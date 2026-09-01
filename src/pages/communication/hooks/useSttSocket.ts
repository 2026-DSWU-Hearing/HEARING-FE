import { useCallback, useEffect, useRef, useState } from 'react';

import {
  STT_EOS_MESSAGE,
  STT_FINAL_WAIT_MS,
  STT_MAX_BUFFERED_AMOUNT,
  STT_MESSAGE,
  STT_TOKEN_URL,
  buildSttStreamUrl,
} from '@/pages/communication/constants/sttConfig';
import type {
  SttResultMessageTypes,
  SttStatusTypes,
} from '@/pages/communication/types/sttTypes';
import { createAudioCapture } from '@/pages/liveSound/utils/createAudioCapture';
import type { AudioCaptureTypes } from '@/pages/liveSound/utils/createAudioCapture';
import { getMicrophoneErrorMessage } from '@/pages/liveSound/utils/getMicrophoneErrorMessage';

interface UseSttSocketParamsTypes {
  // 인식 중인 중간 결과. 말하는 동안 계속 갱신된다.
  onPartialText: (text: string) => void;
  // 한 문장이 확정된 결과. 화면에는 이 시점에 버블로 쌓는다.
  onFinalText: (text: string) => void;
}

// RTZR(VITO) 실시간 STT 소켓 훅.
// 마이크를 열어 16kHz PCM int16 청크를 소켓으로 흘려보내고, 내려오는 인식 결과를
// 중간(partial) / 확정(final)으로 나눠 콜백으로 넘긴다.
//
// 마이크 캡처는 실시간 소리 화면과 규격이 같아서 createAudioCapture를 그대로 재사용한다.
export const useSttSocket = ({
  onPartialText,
  onFinalText,
}: UseSttSocketParamsTypes) => {
  const [status, setStatus] = useState<SttStatusTypes>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const socketRef = useRef<WebSocket | null>(null);
  const captureRef = useRef<AudioCaptureTypes | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 콜백이 매 렌더 새로 만들어져도 start/stop이 다시 만들어지지 않도록 ref로 들고 있는다.
  const handlersRef = useRef({ onPartialText, onFinalText });
  useEffect(() => {
    handlersRef.current = { onPartialText, onFinalText };
  });

  const clearCloseTimer = () => {
    if (!closeTimerRef.current) return;

    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  };

  const stopCapture = () => {
    // stop()은 멱등이라 여러 번 불려도 안전하다.
    void captureRef.current?.stop();
    captureRef.current = null;
  };

  const start = useCallback(async () => {
    // 이미 열려 있으면 중복 연결하지 않는다(StrictMode 이중 실행 포함).
    if (socketRef.current) return;

    setStatus('connecting');
    setErrorMessage('');

    // 소켓 업그레이드에는 Authorization 헤더가 필요한데 브라우저가 붙일 수 없어서,
    // 서버가 미리 토큰을 준비하도록 먼저 호출한다(토큰 값 자체는 받지 않는다).
    try {
      const response = await fetch(STT_TOKEN_URL);
      if (!response.ok) {
        throw new Error(`토큰 준비 실패: ${response.status}`);
      }
    } catch (error) {
      console.error('[STT] 토큰 준비 실패:', error);
      setErrorMessage(STT_MESSAGE.TOKEN_FAILED);
      setStatus('error');
      return;
    }

    const socket = new WebSocket(buildSttStreamUrl());
    socket.binaryType = 'arraybuffer';
    socketRef.current = socket;

    socket.onopen = async () => {
      try {
        captureRef.current = await createAudioCapture({
          onChunk: (chunk) => {
            if (socket.readyState !== WebSocket.OPEN) return;
            // 전송이 밀리면 최신 오디오를 우선하고 밀린 청크는 버린다.
            if (socket.bufferedAmount > STT_MAX_BUFFERED_AMOUNT) return;

            // convertFloat32ToInt16이 청크마다 새 Int16Array를 만들어 주므로
            // buffer 전체가 곧 이 청크다(offset 0, 길이 동일). 복사 없이 그대로 보낸다.
            socket.send(chunk.buffer as ArrayBuffer);
          },
        });

        setStatus('listening');
      } catch (error) {
        console.error('[STT] 마이크 시작 실패:', error);
        setErrorMessage(getMicrophoneErrorMessage(error));
        setStatus('error');
        socket.close();
      }
    };

    socket.onmessage = (event: MessageEvent<string>) => {
      if (typeof event.data !== 'string') return;

      let message: SttResultMessageTypes;
      try {
        message = JSON.parse(event.data) as SttResultMessageTypes;
      } catch {
        return;
      }

      // alternatives[0]이 가장 확률 높은 후보다.
      const text = message.alternatives?.[0]?.text?.trim() ?? '';
      if (!text) return;

      if (message.final) {
        handlersRef.current.onFinalText(text);
        return;
      }

      handlersRef.current.onPartialText(text);
    };

    socket.onerror = () => {
      setErrorMessage(STT_MESSAGE.SOCKET_FAILED);
      setStatus('error');
    };

    socket.onclose = () => {
      clearCloseTimer();
      stopCapture();

      if (socketRef.current === socket) {
        socketRef.current = null;
      }

      // 에러로 닫힌 경우에는 사용자에게 보여줄 문구를 지우지 않는다.
      setStatus((prevStatus) => (prevStatus === 'error' ? 'error' : 'idle'));
    };
  }, []);

  const stop = useCallback(() => {
    const socket = socketRef.current;

    // 마이크는 기다리지 않고 바로 끈다(녹음 표시가 남지 않도록).
    stopCapture();

    // 소켓 참조를 먼저 비워서, 마지막 결과를 기다리는 동안에도 바로 다시 시작할 수 있게 한다.
    socketRef.current = null;
    setStatus('idle');

    if (!socket) return;

    if (socket.readyState !== WebSocket.OPEN) {
      socket.close();
      return;
    }

    // EOS를 보내야 마지막 문장의 final이 내려온다. 그 결과를 받고 나서 닫는다.
    socket.send(STT_EOS_MESSAGE);

    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null;
      socket.close();
    }, STT_FINAL_WAIT_MS);
  }, []);

  // 페이지를 떠날 때 마이크와 소켓을 확실히 정리한다.
  useEffect(() => {
    return () => {
      clearCloseTimer();
      stopCapture();
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, []);

  return { status, errorMessage, start, stop };
};
