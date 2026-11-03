import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useLiveSoundSocket } from '@/pages/liveSound/hooks/useLiveSoundSocket';
import { useSttSocket } from '@/pages/communication/hooks/useSttSocket';
import { createAudioCapture } from '@/pages/liveSound/utils/createAudioCapture';
import type { AudioCaptureTypes } from '@/pages/liveSound/utils/createAudioCapture';
import { SOCKET_CONNECTION_TIMEOUT_MS } from '@/shared/constants/networkConstants';
import {
  STT_FINAL_WAIT_MS,
  STT_MESSAGE,
} from '@/pages/communication/constants/sttConfig';
import { refreshAccessToken } from '@/shared/apis/axios';
import { isTokenExpired } from '@/shared/utils/jwt';
import { MockWebSocket } from './fixtures/mockWebSocket';

vi.mock('@/pages/login/utils/tokenStorage', () => ({
  getAccessToken: () => 'test-token',
}));
vi.mock('@/shared/utils/jwt', () => ({ isTokenExpired: vi.fn(() => false) }));
vi.mock('@/shared/utils/getWebSocketBaseUrl', () => ({
  getWebSocketBaseUrl: () => 'ws://localhost',
}));
vi.mock('@/shared/apis/axios', () => ({
  refreshAccessToken: vi.fn(async () => 'refreshed-test-token'),
}));
vi.mock(
  '@/pages/liveSound/utils/createAudioCapture',
  async (importOriginal) => {
    const original =
      await importOriginal<
        typeof import('@/pages/liveSound/utils/createAudioCapture')
      >();
    return { ...original, createAudioCapture: vi.fn() };
  },
);

const createCapture = (): AudioCaptureTypes => ({
  captureMode: 'worklet',
  contextSampleRate: 16000,
  getAmplitude: () => 0,
  stop: vi.fn(async () => {}),
});

const renderLiveSound = () =>
  renderHook(() =>
    useLiveSoundSocket({
      onClassification: vi.fn(),
      onSessionStart: vi.fn(),
    }),
  );
const renderStt = () =>
  renderHook(() =>
    useSttSocket({
      onPartialText: vi.fn(),
      onFinalText: vi.fn(),
    }),
  );

beforeEach(() => {
  vi.useFakeTimers();
  MockWebSocket.instances = [];
  vi.mocked(isTokenExpired).mockReturnValue(false);
  vi.mocked(refreshAccessToken)
    .mockReset()
    .mockResolvedValue('refreshed-test-token');
  vi.stubGlobal('WebSocket', MockWebSocket);
  vi.mocked(createAudioCapture)
    .mockReset()
    .mockImplementation(async () => createCapture());
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'info').mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.clearAllTimers();
});

describe('실시간 소리 연결', () => {
  it.each(['handshake', 'ready'])(
    '%s 무응답을 5초에 종료하고 재시도할 수 있다',
    async (phase) => {
      const { result } = renderLiveSound();
      await act(async () => result.current.startSession());
      const socket = MockWebSocket.instances[0];
      if (phase === 'ready') await act(async () => socket.open());
      await act(async () =>
        vi.advanceTimersByTimeAsync(SOCKET_CONNECTION_TIMEOUT_MS),
      );
      expect(result.current.status).toBe('error');
      expect(result.current.alertMessage).not.toBe('');
      expect(socket.close).toHaveBeenCalledTimes(1);
      expect(createAudioCapture).not.toHaveBeenCalled();
      await act(async () => result.current.startSession());
      expect(MockWebSocket.instances).toHaveLength(2);
      expect(result.current.status).toBe('connecting');
    },
  );

  it('ready 후 정상 감지를 유지하고 중복 ready는 마이크를 다시 열지 않는다', async () => {
    const { result } = renderLiveSound();
    await act(async () => result.current.startSession());
    const socket = MockWebSocket.instances[0];
    await act(async () => {
      await socket.open();
      socket.receive({ type: 'ready' });
      socket.receive({ type: 'ready' });
    });
    await act(async () =>
      vi.advanceTimersByTimeAsync(SOCKET_CONNECTION_TIMEOUT_MS * 2),
    );
    expect(result.current.status).toBe('listening');
    expect(createAudioCapture).toHaveBeenCalledTimes(1);
    expect(socket.close).not.toHaveBeenCalled();
  });

  it('close 이벤트 없는 소켓 오류도 즉시 정리한다', async () => {
    const { result } = renderLiveSound();
    await act(async () => result.current.startSession());
    const socket = MockWebSocket.instances[0];
    await act(async () => socket.onerror?.(new Event('error')));
    expect(result.current.status).toBe('error');
    expect(socket.close).toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('인증 재연결 시 이전 연결의 타이머가 새 연결을 끊지 않는다', async () => {
    const { result } = renderLiveSound();
    await act(async () => result.current.startSession());
    await act(async () => vi.advanceTimersByTimeAsync(4000));
    await act(async () => MockWebSocket.instances[0].serverClose(4401));
    expect(MockWebSocket.instances).toHaveLength(2);
    await act(async () => vi.advanceTimersByTimeAsync(1000));
    expect(result.current.status).toBe('connecting');
    await act(async () => vi.advanceTimersByTimeAsync(4000));
    expect(result.current.status).toBe('error');
  });

  it('연결 취소 및 페이지 이탈 때 소켓과 타이머를 해제한다', async () => {
    const { result, unmount } = renderLiveSound();
    await act(async () => result.current.startSession());
    await act(async () => result.current.stopSession());
    await act(async () =>
      vi.advanceTimersByTimeAsync(SOCKET_CONNECTION_TIMEOUT_MS),
    );
    expect(result.current.status).toBe('idle');
    await act(async () => result.current.startSession());
    const currentSocket = MockWebSocket.instances[1];
    unmount();
    await act(async () => {});
    expect(currentSocket.close).toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('취소한 세션에서 늦게 열린 마이크를 정리한다', async () => {
    let resolveCapture!: (capture: AudioCaptureTypes) => void;
    vi.mocked(createAudioCapture).mockReturnValueOnce(
      new Promise((resolve) => {
        resolveCapture = resolve;
      }),
    );
    const { result } = renderLiveSound();
    await act(async () => result.current.startSession());
    const socket = MockWebSocket.instances[0];
    await act(async () => {
      await socket.open();
      socket.receive({ type: 'ready' });
    });
    await act(async () => result.current.stopSession());
    const lateCapture = createCapture();
    await act(async () => resolveCapture(lateCapture));
    expect(lateCapture.stop).toHaveBeenCalled();
    expect(result.current.status).toBe('idle');
  });
});

describe('양방향 소통 연결', () => {
  it('핸드셰이크 무응답을 5초에 종료하고 재시도할 수 있다', async () => {
    const { result } = renderStt();
    await act(async () => result.current.start(1));
    await act(async () =>
      vi.advanceTimersByTimeAsync(SOCKET_CONNECTION_TIMEOUT_MS),
    );
    expect(result.current.status).toBe('error');
    expect(result.current.errorMessage).toContain('시간이 초과');
    expect(MockWebSocket.instances[0].close).toHaveBeenCalled();
    expect(createAudioCapture).not.toHaveBeenCalled();
    await act(async () => result.current.start(1));
    expect(MockWebSocket.instances).toHaveLength(2);
    expect(result.current.status).toBe('connecting');
  });

  it('정상 연결 후에는 연결 타임아웃을 해제한다', async () => {
    const { result } = renderStt();
    await act(async () => result.current.start(1));
    await act(async () => MockWebSocket.instances[0].open());
    await act(async () =>
      vi.advanceTimersByTimeAsync(SOCKET_CONNECTION_TIMEOUT_MS * 2),
    );
    expect(result.current.status).toBe('listening');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('close 이벤트 없는 소켓 오류도 마이크와 소켓을 정리한다', async () => {
    const capture = createCapture();
    vi.mocked(createAudioCapture).mockResolvedValueOnce(capture);
    const { result } = renderStt();
    await act(async () => result.current.start(1));
    const socket = MockWebSocket.instances[0];
    await act(async () => socket.open());
    await act(async () => socket.onerror?.(new Event('error')));
    expect(result.current.status).toBe('error');
    expect(capture.stop).toHaveBeenCalled();
    expect(socket.close).toHaveBeenCalled();
  });

  it('연결 취소 후 타임아웃이 오류 상태를 만들지 않는다', async () => {
    const { result } = renderStt();
    await act(async () => result.current.start(1));
    act(() => result.current.stop());
    await act(async () =>
      vi.advanceTimersByTimeAsync(SOCKET_CONNECTION_TIMEOUT_MS),
    );
    expect(result.current.status).toBe('idle');
    expect(result.current.errorMessage).toBe('');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('이전 마이크 권한 요청의 늦은 실패가 새 세션을 변경하지 않는다', async () => {
    let rejectCapture!: (reason: Error) => void;
    vi.mocked(createAudioCapture).mockReturnValueOnce(
      new Promise((_resolve, reject) => {
        rejectCapture = reject;
      }),
    );
    const { result } = renderStt();
    await act(async () => result.current.start(1));
    const openingCapture = MockWebSocket.instances[0].open();
    act(() => result.current.stop());
    await act(async () => result.current.start(2));
    await act(async () => MockWebSocket.instances[1].open());
    await act(async () => {
      rejectCapture(new Error('late microphone failure'));
      await openingCapture;
    });
    expect(result.current.status).toBe('listening');
    expect(result.current.errorMessage).toBe('');
    expect(MockWebSocket.instances[1].close).not.toHaveBeenCalled();
  });

  it('중지 후 마지막 결과를 수신하고 제한 시간 후 소켓을 닫는다', async () => {
    const onFinalText = vi.fn();
    const { result } = renderHook(() =>
      useSttSocket({ onPartialText: vi.fn(), onFinalText }),
    );
    await act(async () => result.current.start(1));
    const socket = MockWebSocket.instances[0];
    await act(async () => socket.open());
    act(() => result.current.stop());
    expect(socket.send).toHaveBeenCalledWith('EOS');
    act(() => socket.receive({ content: '마지막 문장', isFinal: true }));
    expect(onFinalText).toHaveBeenCalledWith('마지막 문장', true);
    await act(async () => vi.advanceTimersByTimeAsync(STT_FINAL_WAIT_MS));
    expect(socket.close).toHaveBeenCalled();
  });

  it.each(['server-close', 'timeout'])(
    '최종 결과가 없으면 %s 이후 무음 안내를 표시하고 직접 정리한다',
    async (phase) => {
      const { result } = renderStt();
      await act(async () => result.current.start(1));
      const socket = MockWebSocket.instances[0];
      await act(async () => socket.open());
      act(() => result.current.stop());
      if (phase === 'server-close') act(() => socket.serverClose(1000));
      else
        await act(async () => vi.advanceTimersByTimeAsync(STT_FINAL_WAIT_MS));
      expect(result.current.errorMessage).toBe(STT_MESSAGE.NO_SPEECH);
      expect(socket.onmessage).toBeNull();
      expect(socket.close).toHaveBeenCalledTimes(1);
      expect(vi.getTimerCount()).toBe(0);
    },
  );

  it('EOS 이후 소켓 오류를 사용자에게 알리고 직접 정리한다', async () => {
    const { result } = renderStt();
    await act(async () => result.current.start(1));
    const socket = MockWebSocket.instances[0];
    await act(async () => socket.open());
    act(() => result.current.stop());
    act(() => socket.onerror?.(new Event('error')));
    expect(result.current.errorMessage).toBe(STT_MESSAGE.SOCKET_FAILED);
    expect(result.current.status).toBe('error');
    expect(socket.onmessage).toBeNull();
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each(['error', 'timeout'])(
    '빠른 재시작 후 이전 final은 보존하고 이전 %s는 새 녹음에 영향을 주지 않는다',
    async (phase) => {
      const onPartialText = vi.fn();
      const onFinalText = vi.fn();
      const { result } = renderHook(() =>
        useSttSocket({ onPartialText, onFinalText }),
      );
      await act(async () => result.current.start(1));
      const previousSocket = MockWebSocket.instances[0];
      await act(async () => previousSocket.open());
      act(() => result.current.stop());
      await act(async () => result.current.start(1));
      const currentSocket = MockWebSocket.instances[1];
      await act(async () => currentSocket.open());
      expect(previousSocket.close).not.toHaveBeenCalled();
      act(() => {
        currentSocket.receive({
          content: '새 녹음의 중간 문장',
          isFinal: false,
        });
        previousSocket.receive({ content: '이전 중간 문장', isFinal: false });
        previousSocket.receive({ content: '이전 마지막 문장', isFinal: true });
      });
      expect(onPartialText).toHaveBeenCalledExactlyOnceWith(
        '새 녹음의 중간 문장',
      );
      expect(onFinalText).toHaveBeenCalledExactlyOnceWith(
        '이전 마지막 문장',
        false,
      );
      if (phase === 'error')
        act(() => previousSocket.onerror?.(new Event('error')));
      else
        await act(async () => vi.advanceTimersByTimeAsync(STT_FINAL_WAIT_MS));
      expect(previousSocket.onmessage).toBeNull();
      expect(result.current.status).toBe('listening');
      expect(result.current.errorMessage).toBe('');
      expect(currentSocket.close).not.toHaveBeenCalled();
    },
  );

  it('여러 번 중지한 녹음도 언마운트 때 모두 정리한다', async () => {
    const { result, unmount } = renderStt();
    for (let index = 0; index < 3; index += 1) {
      await act(async () => result.current.start(1));
      await act(async () => MockWebSocket.instances[index].open());
      act(() => result.current.stop());
    }
    unmount();
    for (const socket of MockWebSocket.instances) {
      expect(socket.close).toHaveBeenCalledTimes(1);
      expect(socket.onmessage).toBeNull();
    }
    expect(vi.getTimerCount()).toBe(0);
  });

  it('페이지 이탈 시 마지막 결과를 기다리는 소켓과 타이머도 해제한다', async () => {
    const { result, unmount } = renderStt();
    await act(async () => result.current.start(1));
    const socket = MockWebSocket.instances[0];
    await act(async () => socket.open());
    act(() => result.current.stop());
    unmount();
    expect(socket.close).toHaveBeenCalled();
    expect(socket.onmessage).toBeNull();
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe.each(['liveSound', 'stt'] as const)('%s 토큰 갱신', (feature) => {
  it('HTTP 갱신 타임아웃 결과를 오류로 처리하고 다시 시작할 수 있다', async () => {
    vi.mocked(isTokenExpired).mockReturnValue(true);
    // refreshAccessToken의 실제 HTTP 타임아웃은 httpTimeout.test.ts에서 검증한다.
    vi.mocked(refreshAccessToken).mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(() => resolve(null), 5000)),
    );
    const { result } = renderHook(() => {
      const liveSound = useLiveSoundSocket({
        onClassification: vi.fn(),
        onSessionStart: vi.fn(),
      });
      const stt = useSttSocket({
        onPartialText: vi.fn(),
        onFinalText: vi.fn(),
      });
      return feature === 'liveSound'
        ? {
            start: liveSound.startSession,
            status: liveSound.status,
            message: liveSound.alertMessage,
          }
        : {
            start: () => stt.start(1),
            status: stt.status,
            message: stt.errorMessage,
          };
    });
    act(() => {
      void result.current.start();
    });
    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.status).toBe('connecting');
    await act(async () => vi.advanceTimersByTimeAsync(5000));
    expect(refreshAccessToken).toHaveBeenCalledOnce();
    expect(result.current.status).toBe('error');
    expect(result.current.message).not.toBe('');
    expect(MockWebSocket.instances).toHaveLength(0);
    vi.mocked(isTokenExpired).mockReturnValue(false);
    await act(async () => result.current.start());
    expect(result.current.status).toBe('connecting');
    expect(MockWebSocket.instances).toHaveLength(1);
  });
});
