import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useGetCommunicationMock } from '@/pages/communication/hooks/useGetCommunicationMock';
import { useSttSocket } from '@/pages/communication/hooks/useSttSocket';
import { useActiveConversationStore } from '@/pages/communication/stores/useActiveConversationStore';
import {
  createConversationHistoryId,
  useConversationHistoryStore,
} from '@/pages/communication/stores/useConversationHistoryStore';
import { useFavoriteAnswerStore } from '@/pages/communication/stores/useFavoriteAnswerStore';
import type {
  BubbleInputTypes,
  ChatBubbleTypes,
} from '@/pages/communication/types/communication-Types';
import { formatConversationTimestamp } from '@/pages/communication/utils/formatConversationTimestamp';
import { useModal } from '@/shared/hooks/useModal';

// '대화가 저장되었습니다' 안내가 화면에 떠 있는 시간(ms)
const SAVED_NOTICE_DURATION = 2000;

// 양방향 소통(Communication) 페이지의 상태/핸들러를 모아둔 훅.
export const useCommunicationPage = () => {
  const navigate = useNavigate();
  const { data } = useGetCommunicationMock();
  const conversation = data?.conversation ?? null;

  // 답변 목록 자체는 모달(useFavoriteAnswerModal)이 스토어에서 직접 구독한다.
  // 여기서는 목데이터를 스토어에 채우는 역할만 한다.
  const initializeFavoriteAnswers = useFavoriteAnswerStore(
    (state) => state.initialize,
  );
  const addHistory = useConversationHistoryStore((state) => state.addHistory);
  const favoriteAnswerModal = useModal();

  // STT 소켓 주소에 대화 id가 필요해서, 마이크를 켜기 전에 대화부터 만든다.
  const ensureConversation = useActiveConversationStore(
    (state) => state.ensureConversation,
  );
  const endConversation = useActiveConversationStore((state) => state.end);
  const conversationError = useActiveConversationStore((state) => state.error);

  const [bubbles, setBubbles] = useState<ChatBubbleTypes[]>([]);
  const [draftReply, setDraftReply] = useState('');
  // 왼쪽(상대방) 버블. STT 중간 결과가 여기에 실시간으로 흐르고,
  // 마이크를 쓰지 않을 때는 직접 타이핑해서 확정할 수도 있다.
  const [draftListening, setDraftListening] = useState('');
  const [isSavedNoticeOpen, setIsSavedNoticeOpen] = useState(false);

  // 새로 추가되는 버블에 부여할 다음 id. 목데이터의 마지막 id 다음부터 이어간다.
  const nextBubbleIdRef = useRef(0);
  // 첫 버블이 생긴 시각. 대화를 종료할 때 기록의 startedAt으로 쓴다.
  const startedAtRef = useRef<string | null>(null);
  const savedNoticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // 왼쪽/오른쪽 공통: 입력값을 trim해서 버블로 확정하고 draft를 비운다.
  const submitBubble = (
    direction: 'left' | 'right',
    content: string,
    inputType: BubbleInputTypes = 'text',
  ) => {
    const trimmedContent = content.trim();
    if (!trimmedContent) return;

    // 첫 발화 시점을 대화 시작 시각으로 본다(마이크만 켜고 아무 말 없이 끄는 경우 제외).
    if (!startedAtRef.current) {
      startedAtRef.current = formatConversationTimestamp();
    }

    const id = nextBubbleIdRef.current;
    nextBubbleIdRef.current += 1;

    const newBubble: ChatBubbleTypes = {
      id,
      direction,
      inputType,
      content: trimmedContent,
    };

    setBubbles((prev) => [...prev, newBubble]);
  };

  // RTZR 실시간 STT. 중간 결과는 왼쪽 입력 버블에 흘리고,
  // 문장이 확정되면(final) 그 자리를 비우고 대화기록에 버블로 쌓는다.
  const {
    status: sttStatus,
    errorMessage: sttErrorMessage,
    start: startStt,
    stop: stopStt,
  } = useSttSocket({
    onPartialText: (text) => {
      setDraftListening(text);
    },
    onFinalText: (text) => {
      submitBubble('left', text, 'stt');
      setDraftListening('');
    },
  });

  // 연결 중에도 버튼은 '녹음 중'으로 보여줘야 두 번 눌리지 않는다.
  const isListening = sttStatus === 'connecting' || sttStatus === 'listening';

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

  useEffect(() => {
    if (!data) return;

    initializeFavoriteAnswers(data.favoriteAnswers);
  }, [data, initializeFavoriteAnswers]);

  // 언마운트 시 남아있는 안내 타이머를 정리한다.
  useEffect(() => {
    return () => {
      if (savedNoticeTimerRef.current) {
        clearTimeout(savedNoticeTimerRef.current);
      }
    };
  }, []);

  const handleOpenHistory = () => {
    navigate('/communication/histories');
  };

  const handleToggleRecording = async () => {
    if (isListening) {
      stopStt();
      return;
    }

    try {
      const conversation = await ensureConversation();
      await startStt(conversation.conversation_id);
    } catch (error) {
      // 사용자에게 보여줄 문구는 스토어(conversationError)가 이미 채운다.
      console.error('[STT] 대화 생성 실패:', error);
    }
  };

  const handleDraftReplyChange = (value: string) => {
    setDraftReply(value);
  };

  const handleDraftListeningChange = (value: string) => {
    setDraftListening(value);
  };

  const handleSubmitReply = () => {
    submitBubble('right', draftReply);
    setDraftReply('');
  };

  const handleSubmitListening = () => {
    submitBubble('left', draftListening);
    setDraftListening('');
  };

  const handleSelectFavoriteAnswer = (content: string) => {
    submitBubble('right', content, 'favorite_answer');
  };

  const handleEndConversation = () => {
    stopStt();
    setDraftListening('');

    // 대화 전체를 여기서 한 번에 서버로 올린다.
    // 버블이 없으면(마이크만 켰다 끈 경우) 스토어가 만들어둔 빈 대화를 지운다.
    // 로컬 기록이 먼저이므로 응답을 기다리지 않는다 - 실패해도 화면에는 남는다.
    void endConversation(
      bubbles.map(({ direction, inputType, content }) => ({
        direction,
        inputType,
        content,
      })),
    );

    if (bubbles.length === 0) return;

    // 기록은 localStorage에 쌓는다. 오프라인에서도 확실히 남고, 서버 저장이
    // 실패해도 사용자가 잃는 게 없다. 목록에는 첫 마디가 제목으로 보인다.
    addHistory({
      id: createConversationHistoryId(),
      title: bubbles[0].content,
      locationName: conversation?.locationName ?? '',
      startedAt: startedAtRef.current ?? formatConversationTimestamp(),
      endedAt: formatConversationTimestamp(),
      bubbles,
    });

    // 화면을 비워 다음 대화를 새로 시작한다.
    setBubbles([]);
    startedAtRef.current = null;

    if (savedNoticeTimerRef.current) {
      clearTimeout(savedNoticeTimerRef.current);
    }

    setIsSavedNoticeOpen(true);
    savedNoticeTimerRef.current = setTimeout(() => {
      setIsSavedNoticeOpen(false);
    }, SAVED_NOTICE_DURATION);
  };

  return {
    conversation,
    bubbles,
    isListening,
    // 대화 생성 실패도 같은 자리에 보여준다(마이크를 못 켠 이유는 사용자 입장에선 하나다).
    sttErrorMessage: sttErrorMessage || conversationError,
    draftReply,
    draftListening,
    isSavedNoticeOpen,
    isFavoriteAnswerOpen: favoriteAnswerModal.isOpen,
    handleOpenHistory,
    handleOpenFavoriteAnswer: favoriteAnswerModal.open,
    handleCloseFavoriteAnswer: favoriteAnswerModal.close,
    handleSelectFavoriteAnswer,
    handleToggleRecording,
    handleDraftReplyChange,
    handleDraftListeningChange,
    handleSubmitReply,
    handleSubmitListening,
    handleEndConversation,
  };
};
