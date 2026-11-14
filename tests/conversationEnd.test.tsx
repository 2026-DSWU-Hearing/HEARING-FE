import type { ReactNode } from 'react';
import { act, cleanup, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  deleteConversation,
  postConversation,
  postConversationEnd,
} from '@/pages/communication/apis/conversationApi';
import { STT_FINAL_WAIT_MS } from '@/pages/communication/constants/sttConfig';
import { useCommunicationPage } from '@/pages/communication/hooks/useCommunicationPage';
import { useActiveConversationStore } from '@/pages/communication/stores/useActiveConversationStore';
import { createAudioCapture } from '@/pages/liveSound/utils/createAudioCapture';
import type { AudioCaptureTypes } from '@/pages/liveSound/utils/createAudioCapture';
import { MockWebSocket } from './fixtures/mockWebSocket';

vi.mock('@/pages/communication/apis/conversationApi', () => ({
  postConversation: vi.fn(),
  postConversationEnd: vi.fn(),
  deleteConversation: vi.fn(),
}));
vi.mock('@/pages/communication/hooks/useGetCurrentLocationName', () => ({
  useGetCurrentLocationName: () => '',
}));
vi.mock('@/pages/login/utils/tokenStorage', () => ({
  getAccessToken: () => 'test-token',
}));
vi.mock('@/shared/utils/jwt', () => ({ isTokenExpired: () => false }));
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

const CONVERSATION_ID = 7;

const createCapture = (): AudioCaptureTypes => ({
  captureMode: 'worklet',
  contextSampleRate: 16000,
  getAmplitude: () => 0,
  stop: vi.fn(async () => {}),
});

let queryClient: QueryClient;

const Wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter>{children}</MemoryRouter>
  </QueryClientProvider>
);

const renderPage = () =>
  renderHook(() => useCommunicationPage(), { wrapper: Wrapper });

// 마이크를 켜고 소켓이 열려 '듣는 중'이 될 때까지 진행한다.
const startListening = async (
  result: ReturnType<typeof renderPage>['result'],
) => {
  await act(async () => result.current.handleToggleRecording());
  const socket = MockWebSocket.instances[0];
  await act(async () => socket.open());
  expect(result.current.isListening).toBe(true);
  return socket;
};

beforeEach(() => {
  vi.useFakeTimers();
  MockWebSocket.instances = [];
  vi.stubGlobal('WebSocket', MockWebSocket);
  queryClient = new QueryClient();
  useActiveConversationStore.getState().reset();
  useActiveConversationStore.getState().clearBubbles();
  vi.mocked(postConversation).mockResolvedValue({
    conversation_id: CONVERSATION_ID,
    created_at: '2026-11-14T10:00:00+09:00',
  });
  vi.mocked(postConversationEnd).mockResolvedValue({
    conversation_id: CONVERSATION_ID,
    title: '제목',
    summary: '요약',
  });
  vi.mocked(deleteConversation).mockResolvedValue();
  vi.mocked(createAudioCapture).mockImplementation(async () => createCapture());
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  queryClient.clear();
  vi.clearAllTimers();
});

describe('STT 중 대화 종료', () => {
  it('말하는 도중 종료해도 마지막 확정 문장까지 받은 뒤 함께 저장하고 화면을 비운다', async () => {
    const { result } = renderPage();
    const socket = await startListening(result);
    act(() => socket.receive({ content: '첫 문장', isFinal: true }));
    act(() => socket.receive({ content: '말하는 중', isFinal: false }));
    expect(result.current.bubbles).toHaveLength(1);
    expect(result.current.draftListening).toBe('말하는 중');

    let endPromise!: Promise<void>;
    act(() => {
      endPromise = result.current.handleEndConversation();
    });
    expect(socket.send).toHaveBeenCalledWith('EOS');
    expect(result.current.isEndingConversation).toBe(true);
    expect(result.current.draftListening).toBe('');
    // 중지 완료 전에는 서버에 아무것도 보내지 않는다.
    expect(postConversationEnd).not.toHaveBeenCalled();
    expect(deleteConversation).not.toHaveBeenCalled();

    // EOS 이후 늦게 도착한 마지막 문장.
    act(() => socket.receive({ content: '마지막 문장', isFinal: true }));
    await act(async () => {
      socket.serverClose(1000);
      await endPromise;
    });

    expect(postConversationEnd).toHaveBeenCalledExactlyOnceWith(
      CONVERSATION_ID,
      [
        { direction: 'left', inputType: 'stt', content: '첫 문장' },
        { direction: 'left', inputType: 'stt', content: '마지막 문장' },
      ],
    );
    expect(deleteConversation).not.toHaveBeenCalled();
    expect(result.current.bubbles).toHaveLength(0);
    expect(result.current.isSavedNoticeOpen).toBe(true);
    expect(result.current.isEndingConversation).toBe(false);
    expect(useActiveConversationStore.getState().conversation).toBeNull();
  });

  it('마지막 문장이 끝내 오지 않고 버블도 없으면 제한 시간 후 빈 대화를 지운다', async () => {
    const { result } = renderPage();
    await startListening(result);

    let endPromise!: Promise<void>;
    act(() => {
      endPromise = result.current.handleEndConversation();
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(STT_FINAL_WAIT_MS);
      await endPromise;
    });

    expect(deleteConversation).toHaveBeenCalledExactlyOnceWith(CONVERSATION_ID);
    expect(postConversationEnd).not.toHaveBeenCalled();
    expect(result.current.bubbles).toHaveLength(0);
    expect(result.current.isSavedNoticeOpen).toBe(false);
    expect(result.current.isEndingConversation).toBe(false);
  });

  it('종료 대기 중에는 마이크를 다시 켜거나 종료를 다시 누를 수 없다', async () => {
    const { result } = renderPage();
    const socket = await startListening(result);

    let endPromise!: Promise<void>;
    act(() => {
      endPromise = result.current.handleEndConversation();
    });
    await act(async () => result.current.handleToggleRecording());
    await act(async () => result.current.handleEndConversation());

    expect(MockWebSocket.instances).toHaveLength(1);
    expect(postConversation).toHaveBeenCalledTimes(1);

    await act(async () => {
      socket.serverClose(1000);
      await endPromise;
    });
    expect(deleteConversation).toHaveBeenCalledTimes(1);
    expect(result.current.isEndingConversation).toBe(false);

    // 종료가 끝난 뒤에는 새 대화로 다시 녹음을 시작할 수 있다.
    await act(async () => result.current.handleToggleRecording());
    expect(postConversation).toHaveBeenCalledTimes(2);
    expect(MockWebSocket.instances).toHaveLength(2);
  });

  it('마이크를 껐다가 3초 안에 다시 켜고 종료해도 이전 녹음의 마지막 문장까지 함께 저장한다', async () => {
    const { result } = renderPage();
    const previousSocket = await startListening(result);
    act(() => previousSocket.receive({ content: '첫 문장', isFinal: true }));

    // 마이크 끄기(이전 소켓은 마지막 문장을 기다리는 중) → 바로 다시 켜기
    await act(async () => result.current.handleToggleRecording());
    await act(async () => result.current.handleToggleRecording());
    const currentSocket = MockWebSocket.instances[1];
    await act(async () => currentSocket.open());
    expect(postConversation).toHaveBeenCalledTimes(1);

    let endPromise!: Promise<void>;
    act(() => {
      endPromise = result.current.handleEndConversation();
    });
    // 새 녹음이 먼저 닫혀도 이전 녹음이 남아 있으면 아직 저장하지 않는다.
    await act(async () => {
      currentSocket.serverClose(1000);
      await Promise.resolve();
    });
    expect(postConversationEnd).not.toHaveBeenCalled();

    act(() =>
      previousSocket.receive({ content: '이전 마지막 문장', isFinal: true }),
    );
    await act(async () => {
      previousSocket.serverClose(1000);
      await endPromise;
    });

    expect(postConversationEnd).toHaveBeenCalledExactlyOnceWith(
      CONVERSATION_ID,
      [
        { direction: 'left', inputType: 'stt', content: '첫 문장' },
        { direction: 'left', inputType: 'stt', content: '이전 마지막 문장' },
      ],
    );
    expect(result.current.bubbles).toHaveLength(0);
    expect(result.current.isSavedNoticeOpen).toBe(true);
  });
});
