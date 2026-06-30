import { useEffect, useRef } from 'react';

import { getAccessToken } from '@/pages/login/utils/tokenStorage';
import { getWebSocketBaseUrl } from '@/shared/utils/getWebSocketBaseUrl';
import type {
  DetectionMessageTypes,
  DetectionTypes,
} from '@/shared/types/detectionTypes';

// 인증 실패 시 서버가 보내는 close code. 토큰 문제이므로 재연결하지 않는다.
const AUTH_FAILED_CLOSE_CODE = 4401;
// 정상 종료(cleanup에서 우리가 의도적으로 닫을 때) 사용하는 close code.
const NORMAL_CLOSE_CODE = 1000;
// 재연결 백오프: 첫 1초에서 시작해 2배씩 늘리고 상한 30초.
const INITIAL_RECONNECT_DELAY = 1000;
const MAX_RECONNECT_DELAY = 30000;

interface UseDetectionSocketParamsTypes {
  onDetection: (detection: DetectionTypes) => void;
}

// 실시간 소리 감지 알림을 받는 WebSocket을 연결하는 훅.
// 토큰이 있을 때만 연결하고, detection 메시지를 받으면 onDetection 콜백으로 넘긴다.
// 비정상 종료 시 지수 백오프로 재연결하되, 인증 실패(4401)는 재연결하지 않는다.
export const useDetectionSocket = ({ onDetection }: UseDetectionSocketParamsTypes) => {
  // 콜백이 매 렌더마다 바뀌어도 effect를 재실행하지 않도록 ref로 최신 콜백을 참조한다.
  const onDetectionRef = useRef(onDetection);
  onDetectionRef.current = onDetection;

  useEffect(() => {
    const token = getAccessToken();
    // 로그인 전(토큰 없음)에는 연결하지 않는다. 로그인 후 재마운트 시 연결된다.
    if (!token) return;

    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let reconnectDelay = INITIAL_RECONNECT_DELAY;
    // cleanup으로 의도적으로 닫은 경우 onclose에서 재연결하지 않도록 표시한다.
    let isUnmounted = false;

    const connect = () => {
      // 토큰에 쿼리스트링 예약 문자(+, /, = 등)가 있어도 깨지지 않도록 인코딩한다.
      const encodedToken = encodeURIComponent(token);
      const url = `${getWebSocketBaseUrl()}/ws/users/me/detections?token=${encodedToken}`;
      socket = new WebSocket(url);

      socket.onopen = () => {
        // 연결에 성공하면 백오프 지연을 초기화한다.
        reconnectDelay = INITIAL_RECONNECT_DELAY;
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
        // 의도적 종료(cleanup)나 인증 실패(4401)는 재연결하지 않는다.
        // 서버발 정상 종료(1000: 재배포/유휴 타임아웃 등)는 재연결 대상이다.
        if (isUnmounted) return;

        if (event.code === AUTH_FAILED_CLOSE_CODE) {
          console.error('[WS] 인증 실패로 연결이 종료되었습니다.');
          return;
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
  }, []);
};
