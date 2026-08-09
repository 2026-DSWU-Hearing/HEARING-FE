import { useCallback, useEffect, useRef, useState } from 'react';

import { refreshAccessToken } from '@/shared/apis/axios';
import { getWebSocketBaseUrl } from '@/shared/utils/getWebSocketBaseUrl';
import { isTokenExpired } from '@/shared/utils/jwt';
import { getAccessToken } from '@/pages/login/utils/tokenStorage';

import { MAX_BUFFERED_AMOUNT } from '../constants/audioConfig';
import { LIVE_SOUND_MESSAGE } from '../constants/liveSoundMessages';
import {
  buildStartMessage,
  buildStopMessage,
  parseLiveSoundMessage,
} from '../constants/liveSoundProtocol';
import type { LiveSoundStatusTypes } from '../types/liveSoundStatusTypes';
import type { LiveSoundClassificationTypes } from '../types/liveSoundSocketTypes';
import {
  createAudioCapture,
  MicrophoneUnsupportedError,
  type AudioCaptureTypes,
} from '../utils/createAudioCapture';
import { getMicrophoneErrorMessage } from '../utils/getMicrophoneErrorMessage';

// 인증 실패 close code로 가정한 값(백엔드 확인 필요).
// 4000~4999는 서버가 정하는 구간이라 표준이 아니고, 핸드셰이크 거부 시 브라우저가 1006을 주기도 한다.
// 값이 달라도 기본 분기로 떨어져 동작은 한다(안내 문구와 토큰 재시도만 덜 정확해진다).
const AUTH_FAILED_CLOSE_CODE = 4401;
const NORMAL_CLOSE_CODE = 1000;
// 소켓은 열렸는데 서버가 응답하지 않을 때 connecting에 영원히 머무는 것을 막는다.
const READY_TIMEOUT_MS = 5000;
const MAX_AUTH_REFRESH_ATTEMPTS = 1;

interface UseLiveSoundSocketParamsTypes {
  onClassification: (classification: LiveSoundClassificationTypes) => void;
  // 세션 시작 직전 호출. 이전 세션의 결과를 지우는 용도.
  onSessionStart: () => void;
}

interface UseLiveSoundSocketReturnTypes {
  status: LiveSoundStatusTypes;
  alertMessage: string;
  startSession: () => void;
  stopSession: () => void;
  clearAlertMessage: () => void;
}

// 실시간 소리 감지 WebSocket을 여닫고 마이크 PCM을 흘려보내는 훅.
//
// 시작 순서: WS 연결 -> start -> ready -> getUserMedia -> 캡처 -> listening.
// 마이크를 ready 이후로 미뤄, 핸드셰이크가 실패하면 마이크가 아예 켜지지 않게 한다.
//
// 자동 재연결은 하지 않는다. 끊기면 서버 세션도 사라져 어차피 새 세션이고,
// 백오프로 기다리는 동안 마이크가 켜진 채 남기 때문이다. 실패는 알리고 사용자가 다시 누르게 한다.
export const useLiveSoundSocket = ({
  onClassification,
  onSessionStart,
}: UseLiveSoundSocketParamsTypes): UseLiveSoundSocketReturnTypes => {
  const [status, setStatus] = useState<LiveSoundStatusTypes>('idle');
  const [alertMessage, setAlertMessage] = useState('');

  // 콜백 identity가 바뀌어도 세션 로직이 재생성되지 않도록 ref로 최신 값을 참조한다.
  const onClassificationRef = useRef(onClassification);
  const onSessionStartRef = useRef(onSessionStart);
  useEffect(() => {
    onClassificationRef.current = onClassification;
    onSessionStartRef.current = onSessionStart;
  });

  const socketRef = useRef<WebSocket | null>(null);
  const audioCaptureRef = useRef<AudioCaptureTypes | null>(null);
  const readyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isStoppingRef = useRef(false);
  // 세션마다 증가시켜, 정리된 세션의 비동기 콜백이 뒤늦게 도착해도 무시하게 한다.
  const sessionIdRef = useRef(0);
  const authRefreshAttemptsRef = useRef(0);
  const droppedChunkCountRef = useRef(0);

  // 화면 상태는 건드리지 않고 세션 자원(타이머·마이크·소켓)만 해제한다.
  // 정리 도중 도착하는 콜백을 무시하도록 세션 번호를 먼저 올린다.
  const releaseSession = useCallback(async () => {
    sessionIdRef.current += 1;

    if (readyTimerRef.current) {
      clearTimeout(readyTimerRef.current);
      readyTimerRef.current = null;
    }

    if (droppedChunkCountRef.current > 0) {
      console.warn(
        `[LiveSound] 네트워크 지연으로 버린 오디오 청크: ${droppedChunkCountRef.current}개`,
      );
      droppedChunkCountRef.current = 0;
    }

    // 마이크를 먼저 끈다. 소켓을 먼저 닫으면 남은 청크가 닫힌 소켓에 send되어 예외가 난다.
    try {
      await audioCaptureRef.current?.stop();
    } catch (error) {
      console.error('[LiveSound] 마이크 정리 중 오류:', error);
    }
    audioCaptureRef.current = null;

    const socket = socketRef.current;
    if (socket) {
      // 의도적 종료가 onclose의 에러 경로를 타지 않도록 핸들러를 먼저 떼어낸다.
      socket.onopen = null;
      socket.onmessage = null;
      socket.onerror = null;
      socket.onclose = null;

      if (socket.readyState === WebSocket.OPEN) {
        socket.send(buildStopMessage());
      }
      socket.close(NORMAL_CLOSE_CODE);
    }
    socketRef.current = null;
  }, []);

  // 사용자 토글, 소켓 종료, 언마운트가 동시에 부를 수 있어 멱등해야 한다.
  const stopSessionInternal = useCallback(
    async (nextStatus: LiveSoundStatusTypes, message?: string) => {
      if (isStoppingRef.current) return;
      isStoppingRef.current = true;

      await releaseSession();

      isStoppingRef.current = false;

      setStatus(nextStatus);
      if (message) setAlertMessage(message);
    },
    [releaseSession],
  );

  const stopSessionRef = useRef(stopSessionInternal);
  useEffect(() => {
    stopSessionRef.current = stopSessionInternal;
  });

  const getValidToken = async (): Promise<string | null> => {
    const storedToken = getAccessToken();
    if (!storedToken) return null;
    if (!isTokenExpired(storedToken)) return storedToken;

    return refreshAccessToken();
  };

  const startSession = useCallback(() => {
    // 클릭 직후 버튼이 죽은 것처럼 보이지 않도록 동기적으로 바꾼다.
    setStatus('connecting');
    setAlertMessage('');
    onSessionStartRef.current();

    authRefreshAttemptsRef.current = 0;

    const connect = async () => {
      const currentSessionId = sessionIdRef.current;
      const isStaleSession = () => sessionIdRef.current !== currentSessionId;

      const validToken = await getValidToken();
      if (isStaleSession()) return;

      if (!validToken) {
        void stopSessionInternal('error', LIVE_SOUND_MESSAGE.AUTH_FAILED);
        return;
      }

      // 토큰의 쿼리스트링 예약 문자(+, /, =)가 깨지지 않도록 인코딩한다.
      const encodedToken = encodeURIComponent(validToken);
      const socket = new WebSocket(
        `${getWebSocketBaseUrl()}/ws/users/me/livesound?token=${encodedToken}`,
      );
      socketRef.current = socket;

      const startCapture = async () => {
        try {
          const capture = await createAudioCapture({
            onChunk: (chunk) => {
              if (socket.readyState !== WebSocket.OPEN) return;

              // 전송이 밀리면 큐가 무한히 자라고 서버는 갈수록 오래된 오디오를 받는다.
              // 실시간 분류에서 늦은 오디오는 가치가 없으므로 버린다.
              if (socket.bufferedAmount > MAX_BUFFERED_AMOUNT) {
                droppedChunkCountRef.current += 1;
                return;
              }

              socket.send(chunk.buffer as ArrayBuffer);
            },
          });

          // 마이크가 열리는 사이에 세션이 정리됐다면 즉시 되돌린다.
          if (isStaleSession()) {
            await capture.stop();
            return;
          }

          audioCaptureRef.current = capture;
          console.info(
            `[LiveSound] 캡처 시작 (mode=${capture.captureMode}, ctx=${capture.contextSampleRate}Hz)`,
          );
          setStatus('listening');
        } catch (error) {
          if (isStaleSession()) return;

          const message =
            error instanceof MicrophoneUnsupportedError
              ? LIVE_SOUND_MESSAGE.NOT_SUPPORTED
              : getMicrophoneErrorMessage(error);
          void stopSessionInternal('error', message);
        }
      };

      socket.onopen = () => {
        socket.send(buildStartMessage());

        readyTimerRef.current = setTimeout(() => {
          console.error(
            '[LiveSound] ready 응답이 오지 않아 연결을 중단합니다.',
          );
          void stopSessionInternal('error', LIVE_SOUND_MESSAGE.CONNECT_FAILED);
        }, READY_TIMEOUT_MS);
      };

      socket.onmessage = (event) => {
        if (typeof event.data !== 'string') return;

        const message = parseLiveSoundMessage(event.data);
        if (!message) return;

        switch (message.type) {
          case 'ready':
            if (readyTimerRef.current) {
              clearTimeout(readyTimerRef.current);
              readyTimerRef.current = null;
            }
            void startCapture();
            break;

          case 'classification':
            onClassificationRef.current(message.data);
            break;

          case 'error':
            console.error('[LiveSound] 서버 오류:', message.message);
            void stopSessionInternal(
              'error',
              message.message || LIVE_SOUND_MESSAGE.SERVER_ERROR,
            );
            break;
        }
      };

      socket.onerror = (error) => {
        console.error('[LiveSound] 소켓 오류:', error);
      };

      socket.onclose = (event) => {
        if (isStaleSession()) return;

        // 캡처가 있다는 건 ready까지 성공했다는 뜻이다.
        const hasStartedCapture = audioCaptureRef.current !== null;

        // 검사 시점엔 유효했는데 서버가 거절한 경우에 한해 한 번만 다시 시도한다.
        if (
          event.code === AUTH_FAILED_CLOSE_CODE &&
          !hasStartedCapture &&
          authRefreshAttemptsRef.current < MAX_AUTH_REFRESH_ATTEMPTS
        ) {
          authRefreshAttemptsRef.current += 1;
          socketRef.current = null;
          void refreshAccessToken().then((refreshedToken) => {
            if (isStaleSession()) return;
            if (!refreshedToken) {
              void stopSessionInternal('error', LIVE_SOUND_MESSAGE.AUTH_FAILED);
              return;
            }
            void connect();
          });
          return;
        }

        if (event.code === AUTH_FAILED_CLOSE_CODE) {
          void stopSessionInternal('error', LIVE_SOUND_MESSAGE.AUTH_FAILED);
          return;
        }

        void stopSessionInternal(
          'error',
          hasStartedCapture
            ? LIVE_SOUND_MESSAGE.CONNECTION_LOST
            : LIVE_SOUND_MESSAGE.CONNECT_FAILED,
        );
      };
    };

    // 이전 세션이 정리되지 않은 채(예: onerror만 나고 close가 없는 경우) 다시 시작하면
    // 소켓/마이크 참조를 잃어 영영 못 닫는다. 새로 열기 전에 반드시 해제한다.
    void releaseSession().then(connect);
  }, [releaseSession, stopSessionInternal]);

  const stopSession = useCallback(() => {
    void stopSessionInternal('idle');
  }, [stopSessionInternal]);

  const clearAlertMessage = useCallback(() => setAlertMessage(''), []);

  // 언마운트/라우트 이동 시 마이크와 소켓을 정리한다.
  useEffect(() => {
    return () => {
      void stopSessionRef.current('idle');
    };
  }, []);

  return { status, alertMessage, startSession, stopSession, clearAlertMessage };
};
