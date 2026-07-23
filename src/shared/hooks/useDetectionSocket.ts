import { useEffect, useRef } from 'react';

import { refreshAccessToken } from '@/shared/apis/axios';
import { getWebSocketBaseUrl } from '@/shared/utils/getWebSocketBaseUrl';
import { isTokenExpired } from '@/shared/utils/jwt';
import { getAccessToken } from '@/pages/login/utils/tokenStorage';

import type {
  DetectionMessageTypes,
  DetectionTypes,
} from '@/shared/types/detectionTypes';

// 인증 실패 시 서버가 보내는 close code.
// 단, 핸드셰이크가 거부되면 브라우저는 4401 대신 1006을 주기도 하므로 단독 신호로는 부족하다.
const AUTH_FAILED_CLOSE_CODE = 4401;
// 정상 종료(cleanup에서 우리가 의도적으로 닫을 때) 사용하는 close code.
const NORMAL_CLOSE_CODE = 1000;
// 재연결 백오프: 첫 1초에서 시작해 2배씩 늘리고 상한 30초.
const INITIAL_RECONNECT_DELAY = 1000;
const MAX_RECONNECT_DELAY = 30000;
// 한 번도 연결에 성공하지 못한 채(onopen 없이) 닫히는 상황의 연속 재시도 상한.
// 가짜/만료 토큰처럼 매번 같은 이유로 거부될 때 서버를 무한히 두드리지 않게 한다.
const MAX_INITIAL_CONNECT_ATTEMPTS = 5;
const MAX_AUTH_REFRESH_ATTEMPTS = 2;

interface UseDetectionSocketParamsTypes {
  // 인증에 쓸 access token. 호출부(App)가 매 렌더마다 최신 값을 읽어 넘긴다.
  // localStorage는 반응형이 아니라(값이 바뀌어도 리렌더가 안 일어남) 훅이 직접 읽으면
  // 로그인 직후 토큰 변경을 감지하지 못한다. 그래서 라우트 변경 등으로 리렌더되는
  // 호출부가 토큰을 주입하고, 토큰이 바뀌면(=의존성 변경) 그때 연결을 트리거한다.
  token: string | null;
  onDetection: (detection: DetectionTypes) => void;
}

// 실시간 소리 감지 알림을 받는 WebSocket을 연결하는 훅.
// 토큰이 있을 때만 연결하고, detection 메시지를 받으면 onDetection 콜백으로 넘긴다.
// 비정상 종료 시 지수 백오프로 재연결하되, 연결조차 못 한
// 반복 거부(상한 초과)는 재연결하지 않아 잘못된 토큰으로 서버를 무한히 두드리지 않는다.
export const useDetectionSocket = ({ token, onDetection }: UseDetectionSocketParamsTypes) => {
  // 콜백이 매 렌더마다 바뀌어도 effect를 재실행하지 않도록 ref로 최신 콜백을 참조한다.
  const onDetectionRef = useRef(onDetection);
  useEffect(() => {
    onDetectionRef.current = onDetection;
  });

  useEffect(() => {
    // 로그인 전(토큰 없음)에는 연결하지 않는다. 토큰이 생겨 재호출되면 그때 연결된다.
    if (!token) return;

    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let reconnectDelay = INITIAL_RECONNECT_DELAY;
    // cleanup으로 의도적으로 닫은 경우 onclose에서 재연결하지 않도록 표시한다.
    let isUnmounted = false;
    // 한 번이라도 연결(onopen)에 성공했는지. 성공 이력이 있으면 끊겨도 재연결한다.
    let hasConnected = false;
    // onopen 없이 연속으로 닫힌 횟수. 상한을 넘으면 인증/거부로 보고 재연결을 멈춘다.
    let initialConnectAttempts = 0;
    let authRefreshAttempts = 0;

    const getValidToken = async (): Promise<string | null> => {
      const storedToken = getAccessToken();
      if (!storedToken) return null;
      if (!isTokenExpired(storedToken)) return storedToken;

      return refreshAccessToken();
    };

    const connect = async () => {
      const validToken = await getValidToken();
      if (isUnmounted) return;

      if (!validToken) {
        console.error('[WS] 유효한 토큰을 확보하지 못해 연결을 중단합니다. (재로그인 필요)');
        return;
      }

      // 토큰에 쿼리스트링 예약 문자(+, /, = 등)가 있어도 깨지지 않도록 인코딩한다.
      const encodedToken = encodeURIComponent(validToken);
      const url = `${getWebSocketBaseUrl()}/ws/users/me/detections?token=${encodedToken}`;
      socket = new WebSocket(url);

      socket.onopen = () => {
        // 연결에 성공하면 성공 이력을 남기고 백오프/시도 횟수를 초기화한다.
        hasConnected = true;
        reconnectDelay = INITIAL_RECONNECT_DELAY;
        initialConnectAttempts = 0;
        authRefreshAttempts = 0;
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as DetectionMessageTypes;
          switch (message.type) {
            case 'detection':
              onDetectionRef.current(message.data);
              break;
            default:
              console.warn('[WS] 알 수 없는 메시지 타입:', message);
          }
        } catch (error) {
          console.error('[WS] 감지 메시지 파싱 실패:', error);
        }
      };

      socket.onerror = (error) => {
        console.error('[WS] 연결 오류:', error);
      };

      socket.onclose = (event) => {
        if (isUnmounted) return;

        if (event.code === AUTH_FAILED_CLOSE_CODE) {
          authRefreshAttempts += 1;
          if (authRefreshAttempts > MAX_AUTH_REFRESH_ATTEMPTS) {
            console.error('[WS] 인증 실패가 반복되어 재연결을 중단합니다. (재로그인 필요)');
            return;
          }
          reconnectTimer = setTimeout(connect, INITIAL_RECONNECT_DELAY);
          return;
        }

        // 한 번도 연결에 성공하지 못한 채(onopen 미발생) 닫혔다면 핸드셰이크 거부로 본다.
        // 브라우저가 4401 대신 1006을 주는 경우라, 상한까지만 시도하고 멈춰 무한 재연결을 막는다.
        if (!hasConnected) {
          initialConnectAttempts += 1;
          if (initialConnectAttempts >= MAX_INITIAL_CONNECT_ATTEMPTS) {
            console.error('[WS] 연결에 반복 실패하여 재연결을 중단합니다. (토큰/인증 확인 필요)');
            return;
          }
        }

        // 비정상/정상 종료 모두 지수 백오프로 재연결한다.
        reconnectTimer = setTimeout(connect, reconnectDelay);
        reconnectDelay = Math.min(reconnectDelay * 2, MAX_RECONNECT_DELAY);
      };
    };

    connect();

    return () => {
      isUnmounted = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      socket?.close(NORMAL_CLOSE_CODE);
    };
    // token이 바뀌면(로그인/로그아웃) 기존 연결을 정리하고 새 토큰으로 다시 연결한다.
  }, [token]);
};
