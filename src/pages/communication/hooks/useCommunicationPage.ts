import { useEffect, useRef, useState } from 'react';

import { useGetCommunicationMock } from '@/pages/communication/hooks/useGetCommunicationMock';
import type { ChatBubbleTypes } from '@/pages/communication/types/communication-Types';

// '대화가 저장되었습니다' 안내가 화면에 떠 있는 시간(ms)
const SAVED_NOTICE_DURATION = 2000;

// 양방향 소통(Communication) 페이지의 상태/핸들러를 모아둔 훅.
export const useCommunicationPage = () => {
  const { data } = useGetCommunicationMock();
  const conversation = data?.conversation ?? null;

  const [bubbles, setBubbles] = useState<ChatBubbleTypes[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [draftReply, setDraftReply] = useState('');
  // 왼쪽(상대방) 버블도 임시로 직접 입력해볼 수 있게 해둔 상태. 실제 STT 연동 전까지의 목업용.
  const [draftListening, setDraftListening] = useState('');
  const [isSavedNoticeOpen, setIsSavedNoticeOpen] = useState(false);

  // 새로 추가되는 버블에 부여할 다음 id. 목데이터의 마지막 id 다음부터 이어간다.
  const nextBubbleIdRef = useRef(0);
  const savedNoticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // 목데이터의 기존 대화기록은 화면에 쌓아두지 않고, id 채번 기준으로만 사용한다.
  // 실제 화면에는 Enter로 새로 보낸 메시지부터 쌓인다. 이미 한 번 채번했다면(포커스 복귀
  // 등으로 재요청되어 conversation 참조가 바뀌어도) 다시 덮어쓰지 않는다 - 덮어쓰면
  // 이미 로컬에 쌓인 버블 id와 겹칠 수 있다.
  useEffect(() => {
    if (!conversation || nextBubbleIdRef.current !== 0) return;

    nextBubbleIdRef.current =
      conversation.bubbles.reduce(
        (maxId, bubble) => Math.max(maxId, bubble.id),
        0,
      ) + 1;
  }, [conversation]);

  // 언마운트 시 남아있는 안내 타이머를 정리한다.
  useEffect(() => {
    return () => {
      if (savedNoticeTimerRef.current) {
        clearTimeout(savedNoticeTimerRef.current);
      }
    };
  }, []);

  // TODO: 대화기록 리스트 화면이 만들어지면 그쪽으로 이동시킨다.
  const handleOpenHistory = () => {
    console.log('대화기록 열기');
  };

  // TODO: 자주 쓰는 답변 기능이 만들어지면 그쪽으로 연결한다.
  const handleOpenFavoriteAnswer = () => {
    console.log('자주 쓰는 답변 열기');
  };

  // TODO: 실제 마이크 녹음 + STT 웹소켓 연동은 백엔드 API가 준비되면 이 자리에서 연결한다.
  // (참고: useDetectionSocket과 유사한 형태가 될 것) 지금은 '듣는 중..' 상태 전환까지만 구현한다.
  const handleToggleRecording = () => {
    setIsListening((prev) => !prev);
  };

  const handleDraftReplyChange = (value: string) => {
    setDraftReply(value);
  };

  const handleDraftListeningChange = (value: string) => {
    setDraftListening(value);
  };

  // 왼쪽/오른쪽 공통: 입력값을 trim해서 버블로 확정하고 draft를 비운다.
  const submitBubble = (direction: 'left' | 'right', content: string) => {
    const trimmedContent = content.trim();
    if (!trimmedContent) return;

    const id = nextBubbleIdRef.current;
    nextBubbleIdRef.current += 1;

    const newBubble: ChatBubbleTypes = {
      id,
      direction,
      inputType: 'text',
      content: trimmedContent,
    };

    setBubbles((prev) => [...prev, newBubble]);
  };

  const handleSubmitReply = () => {
    submitBubble('right', draftReply);
    setDraftReply('');
  };

  const handleSubmitListening = () => {
    submitBubble('left', draftListening);
    setDraftListening('');
  };

  const handleEndConversation = () => {
    setIsListening(false);

    if (savedNoticeTimerRef.current) {
      clearTimeout(savedNoticeTimerRef.current);
    }

    setIsSavedNoticeOpen(true);
    savedNoticeTimerRef.current = setTimeout(() => {
      setIsSavedNoticeOpen(false);
    }, SAVED_NOTICE_DURATION);

    // TODO: 대화 저장 API 연동 예정
  };

  return {
    conversation,
    bubbles,
    isListening,
    draftReply,
    draftListening,
    isSavedNoticeOpen,
    handleOpenHistory,
    handleOpenFavoriteAnswer,
    handleToggleRecording,
    handleDraftReplyChange,
    handleDraftListeningChange,
    handleSubmitReply,
    handleSubmitListening,
    handleEndConversation,
  };
};
