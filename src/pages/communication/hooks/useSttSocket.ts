import { useCallback, useEffect, useRef, useState } from 'react';

import {
  STT_CLOSE_MESSAGE,
  STT_CONVERSATION_UNAVAILABLE_CLOSE_CODES,
  STT_EOS_MESSAGE,
  STT_FINAL_WAIT_MS,
  STT_MAX_BUFFERED_AMOUNT,
  STT_MESSAGE,
  STT_SERVER_CLOSE_CODE_MIN,
  buildSttStreamUrl,
} from '@/pages/communication/constants/sttConfig';
import type {
  SttResultMessageTypes,
  SttStatusTypes,
} from '@/pages/communication/types/sttTypes';
import { createAudioCapture } from '@/pages/liveSound/utils/createAudioCapture';
import type { AudioCaptureTypes } from '@/pages/liveSound/utils/createAudioCapture';
import { getMicrophoneErrorMessage } from '@/pages/liveSound/utils/getMicrophoneErrorMessage';
import { getAccessToken } from '@/pages/login/utils/tokenStorage';
import { refreshAccessToken } from '@/shared/apis/axios';
import { SOCKET_CONNECTION_TIMEOUT_MS } from '@/shared/constants/networkConstants';
import { isTokenExpired } from '@/shared/utils/jwt';

interface UseSttSocketParamsTypes {
  onPartialText: (text: string) => void;
  onFinalText: (text: string, isCurrentSession: boolean) => void;
  onConversationUnavailable?: () => void;
}

interface PendingSocketTypes {
  timer: ReturnType<typeof setTimeout>;
  sessionId: number;
  notifyIfNoSpeech: () => void;
  // stop()이 돌려준 Promise를 끝낸다. 마지막 확정 문장 수신이 끝났음을 호출자에게 알린다.
  resolve: () => void;
}

const getValidAccessToken = async (): Promise<string | null> => {
  const storedToken = getAccessToken();
  if (!storedToken) return null;
  if (!isTokenExpired(storedToken)) return storedToken;
  return refreshAccessToken();
};

// 정리한 소켓의 늦은 이벤트가 다음 세션의 상태나 마이크를 변경하지 못하게 한다.
const closeSocket = (socket: WebSocket) => {
  socket.onopen = null;
  socket.onmessage = null;
  socket.onerror = null;
  socket.onclose = null;
  socket.close();
};

export const useSttSocket = ({
  onPartialText,
  onFinalText,
  onConversationUnavailable,
}: UseSttSocketParamsTypes) => {
  const [status, setStatus] = useState<SttStatusTypes>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const socketRef = useRef<WebSocket | null>(null);
  const captureRef = useRef<AudioCaptureTypes | null>(null);
  const connectionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // 종료한 녹음은 새 녹음과 별개로 최대 3초 동안 마지막 확정 문장을 받는다.
  const pendingSocketsRef = useRef(new Map<WebSocket, PendingSocketTypes>());
  const notifyIfNoSpeechRef = useRef<() => void>(() => {});
  const isStartingRef = useRef(false);
  const sessionIdRef = useRef(0);
  const handlersRef = useRef({
    onPartialText,
    onFinalText,
    onConversationUnavailable,
  });
  useEffect(() => {
    handlersRef.current = {
      onPartialText,
      onFinalText,
      onConversationUnavailable,
    };
  });

  const clearConnectionTimer = useCallback(() => {
    if (connectionTimerRef.current !== null) {
      clearTimeout(connectionTimerRef.current);
      connectionTimerRef.current = null;
    }
  }, []);

  const finishPendingSocket = useCallback(
    (socket: WebSocket, message?: string) => {
      const pending = pendingSocketsRef.current.get(socket);
      if (!pending) return;
      clearTimeout(pending.timer);
      pendingSocketsRef.current.delete(socket);
      closeSocket(socket);

      // 이전 녹음의 종료 이벤트가 새 녹음의 상태나 안내를 덮어쓰지 않는다.
      if (sessionIdRef.current === pending.sessionId) {
        if (message) {
          setErrorMessage(message);
          setStatus('error');
        } else {
          pending.notifyIfNoSpeech();
        }
      }
      // 상태 갱신까지 끝낸 뒤에 알려야, 기다리던 쪽이 최신 버블을 읽을 수 있다.
      pending.resolve();
    },
    [],
  );

  const stopCapture = useCallback(() => {
    const capture = captureRef.current;
    captureRef.current = null;
    void capture?.stop().catch((error) => {
      console.error('[STT] 마이크 정리 실패:', error);
    });
  }, []);

  const start = useCallback(
    async (conversationId: number) => {
      if (socketRef.current || isStartingRef.current) return;
      isStartingRef.current = true;
      sessionIdRef.current += 1;
      const sessionId = sessionIdRef.current;
      setStatus('connecting');
      setErrorMessage('');

      const accessToken = await getValidAccessToken();
      if (sessionIdRef.current !== sessionId) return;
      isStartingRef.current = false;
      if (!accessToken) {
        setErrorMessage(STT_MESSAGE.TOKEN_FAILED);
        setStatus('error');
        return;
      }

      let socket: WebSocket;
      try {
        socket = new WebSocket(buildSttStreamUrl(conversationId, accessToken));
      } catch {
        setErrorMessage(STT_MESSAGE.SOCKET_FAILED);
        setStatus('error');
        return;
      }
      socket.binaryType = 'arraybuffer';
      socketRef.current = socket;
      const isCurrentSocket = () =>
        socketRef.current === socket && sessionIdRef.current === sessionId;
      let hasStartedListening = false;
      let hasReceivedText = false;
      let hasFailed = false;

      const notifyIfNoSpeech = () => {
        if (hasStartedListening && !hasReceivedText && !hasFailed) {
          setErrorMessage(STT_MESSAGE.NO_SPEECH);
        }
      };

      notifyIfNoSpeechRef.current = notifyIfNoSpeech;

      const failConnection = (message: string) => {
        if (!isCurrentSocket()) return;
        hasFailed = true;
        clearConnectionTimer();
        socketRef.current = null;
        stopCapture();
        closeSocket(socket);
        setErrorMessage(message);
        setStatus('error');
      };

      connectionTimerRef.current = setTimeout(() => {
        failConnection(STT_MESSAGE.CONNECT_TIMEOUT);
      }, SOCKET_CONNECTION_TIMEOUT_MS);

      socket.onopen = async () => {
        if (!isCurrentSocket()) return;
        clearConnectionTimer();
        try {
          const capture = await createAudioCapture({
            onChunk: (chunk) => {
              if (socket.readyState !== WebSocket.OPEN) return;
              if (socket.bufferedAmount > STT_MAX_BUFFERED_AMOUNT) return;
              socket.send(chunk.buffer as ArrayBuffer);
            },
          });
          // 마이크 권한을 기다리는 동안 취소/이동했다면 늦게 열린 마이크도 즉시 끈다.
          if (!isCurrentSocket() || socket.readyState !== WebSocket.OPEN) {
            await capture.stop();
            return;
          }
          captureRef.current = capture;
          hasStartedListening = true;
          setStatus('listening');
        } catch (error) {
          failConnection(getMicrophoneErrorMessage(error));
        }
      };

      socket.onmessage = (event: MessageEvent<string>) => {
        const pending = pendingSocketsRef.current.get(socket);
        if (!isCurrentSocket() && !pending) return;
        const isCurrentSession =
          isCurrentSocket() || pending?.sessionId === sessionIdRef.current;
        if (typeof event.data !== 'string') return;
        let message: SttResultMessageTypes;
        try {
          message = JSON.parse(event.data) as SttResultMessageTypes;
        } catch {
          return;
        }
        const text = message.content?.trim() ?? '';
        if (!text) return;
        hasReceivedText = true;
        if (message.isFinal)
          handlersRef.current.onFinalText(text, isCurrentSession);
        else if (isCurrentSession) handlersRef.current.onPartialText(text);
      };

      socket.onerror = () => {
        if (pendingSocketsRef.current.has(socket)) {
          hasFailed = true;
          finishPendingSocket(socket, STT_MESSAGE.SOCKET_FAILED);
          return;
        }
        failConnection(STT_MESSAGE.SOCKET_FAILED);
      };

      socket.onclose = (event) => {
        if (pendingSocketsRef.current.has(socket)) {
          finishPendingSocket(
            socket,
            event.code === 1000
              ? undefined
              : (STT_CLOSE_MESSAGE[event.code] ?? STT_MESSAGE.SOCKET_FAILED),
          );
          return;
        }
        if (!isCurrentSocket()) return;
        clearConnectionTimer();
        socketRef.current = null;
        stopCapture();
        closeSocket(socket);

        if (event.code >= STT_SERVER_CLOSE_CODE_MIN) {
          hasFailed = true;
          setErrorMessage(
            STT_CLOSE_MESSAGE[event.code] ?? STT_MESSAGE.SERVER_CLOSED,
          );
          setStatus('error');
          if (STT_CONVERSATION_UNAVAILABLE_CLOSE_CODES.includes(event.code)) {
            handlersRef.current.onConversationUnavailable?.();
          }
          return;
        }
        if (event.code !== 1000 || !hasStartedListening) {
          setErrorMessage(STT_MESSAGE.SOCKET_FAILED);
          setStatus('error');
          return;
        }
        setStatus('idle');
        notifyIfNoSpeech();
      };
    },
    [clearConnectionTimer, finishPendingSocket, stopCapture],
  );

  // 녹음을 끝낸다. 돌려주는 Promise는 마지막 확정 문장 수신이 끝났을 때(서버가 닫거나,
  // 오류가 나거나, 제한 시간이 지나거나, 언마운트로 정리될 때) 완료된다.
  // 대화 종료처럼 "마지막 문장까지 받은 뒤" 해야 하는 작업은 이 Promise를 기다린다.
  const stop = useCallback((): Promise<void> => {
    const socket = socketRef.current;
    sessionIdRef.current += 1;
    isStartingRef.current = false;
    clearConnectionTimer();
    stopCapture();
    socketRef.current = null;
    setStatus('idle');
    if (!socket) return Promise.resolve();
    if (socket.readyState !== WebSocket.OPEN) {
      closeSocket(socket);
      return Promise.resolve();
    }

    // 마지막 확정 문장을 최대 3초 기다린다. 서버가 닫지 않아도 직접 닫는다.
    return new Promise<void>((resolve) => {
      const timer = setTimeout(
        () => finishPendingSocket(socket),
        STT_FINAL_WAIT_MS,
      );
      pendingSocketsRef.current.set(socket, {
        timer,
        sessionId: sessionIdRef.current,
        notifyIfNoSpeech: notifyIfNoSpeechRef.current,
        resolve,
      });
      try {
        socket.send(STT_EOS_MESSAGE);
      } catch {
        finishPendingSocket(socket, STT_MESSAGE.SOCKET_FAILED);
      }
    });
  }, [clearConnectionTimer, finishPendingSocket, stopCapture]);

  useEffect(() => {
    const pendingSockets = pendingSocketsRef.current;
    return () => {
      sessionIdRef.current += 1;
      isStartingRef.current = false;
      clearConnectionTimer();
      for (const [socket, pending] of pendingSockets) {
        clearTimeout(pending.timer);
        closeSocket(socket);
        // 페이지를 떠나도 stop()을 기다리던 대화 종료가 멈추지 않고 저장까지 이어진다.
        pending.resolve();
      }
      pendingSockets.clear();
      stopCapture();
      if (socketRef.current) closeSocket(socketRef.current);
      socketRef.current = null;
    };
  }, [clearConnectionTimer, stopCapture]);

  return { status, errorMessage, start, stop };
};
