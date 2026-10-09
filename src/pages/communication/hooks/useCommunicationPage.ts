import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { CONVERSATION_LIST_QUERY_KEY } from '@/pages/communication/constants/conversationQueryKeys';
import { LOCATION_MESSAGE } from '@/pages/communication/constants/locationMessages';

import { useGetCommunicationMock } from '@/pages/communication/hooks/useGetCommunicationMock';
import { useGetCurrentLocationName } from '@/pages/communication/hooks/useGetCurrentLocationName';
import { useSttSocket } from '@/pages/communication/hooks/useSttSocket';
import { useActiveConversationStore } from '@/pages/communication/stores/useActiveConversationStore';
import type { BubbleInputTypes } from '@/pages/communication/types/communication-Types';
import { useModal } from '@/shared/hooks/useModal';
import { useLocationConsentStore } from '@/shared/stores/useLocationConsentStore';

// '대화가 저장되었습니다' 안내가 화면에 떠 있는 시간(ms)
const SAVED_NOTICE_DURATION = 2000;

// 양방향 소통(Communication) 페이지의 상태/핸들러를 모아둔 훅.
export const useCommunicationPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data } = useGetCommunicationMock();
  const conversation = data?.conversation ?? null;
  const isLocationAgreed = useLocationConsentStore(
    (state) => state.isLocationAgreed,
  );
  const isLocationPromptDeclined = useLocationConsentStore(
    (state) => state.isPromptDeclined,
  );
  const setLocationAgreed = useLocationConsentStore(
    (state) => state.setLocationAgreed,
  );
  const declineLocationPrompt = useLocationConsentStore(
    (state) => state.declinePrompt,
  );
  const currentLocationName = useGetCurrentLocationName(isLocationAgreed);
  const locationName =
    !isLocationAgreed && isLocationPromptDeclined
      ? LOCATION_MESSAGE.UNKNOWN
      : currentLocationName;
  const isLocationConsentOpen = !isLocationAgreed && !isLocationPromptDeclined;

  const favoriteAnswerModal = useModal();

  // STT 소켓 주소에 대화 id가 필요해서, 마이크를 켜기 전에 대화부터 만든다.
  const ensureConversation = useActiveConversationStore(
    (state) => state.ensureConversation,
  );
  const endConversation = useActiveConversationStore((state) => state.end);
  const conversationError = useActiveConversationStore((state) => state.error);
  const isSavingConversation = useActiveConversationStore(
    (state) => state.isSaving,
  );
  const resetConversation = useActiveConversationStore((state) => state.reset);
  const isCreatingConversation = useActiveConversationStore(
    (state) => state.isCreating,
  );
  const bubbles = useActiveConversationStore((state) => state.bubbles);
  const addBubble = useActiveConversationStore((state) => state.addBubble);
  const removeSavedBubbles = useActiveConversationStore(
    (state) => state.removeSavedBubbles,
  );

  const [draftReply, setDraftReply] = useState('');
  // 왼쪽(상대방) 버블. STT 중간 결과가 여기에 실시간으로 흐르고,
  // 마이크를 쓰지 않을 때는 직접 타이핑해서 확정할 수도 있다.
  const [draftListening, setDraftListening] = useState('');
  const [isSavedNoticeOpen, setIsSavedNoticeOpen] = useState(false);

  const isStartingRecordingRef = useRef(false);
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

    addBubble({ direction, inputType, content: trimmedContent });
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
    onConversationUnavailable: resetConversation,
  });

  // 연결 중에도 버튼은 '녹음 중'으로 보여줘야 두 번 눌리지 않는다.
  const isListening =
    isCreatingConversation ||
    sttStatus === 'connecting' ||
    sttStatus === 'listening';

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
    if (isStartingRecordingRef.current) return;

    if (isListening) {
      stopStt();
      return;
    }

    isStartingRecordingRef.current = true;

    try {
      const conversation = await ensureConversation();
      await startStt(conversation.conversation_id);
    } catch (error) {
      // 사용자에게 보여줄 문구는 스토어(conversationError)가 이미 채운다.
      console.error('[STT] 대화 생성 실패:', error);
    } finally {
      isStartingRecordingRef.current = false;
    }
  };

  const handleLocationConsentConfirm = () => {
    setLocationAgreed(true);
  };

  const handleLocationConsentCancel = () => {
    declineLocationPrompt();
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

  const handleEndConversation = async () => {
    if (isSavingConversation) return;

    stopStt();
    setDraftListening('');

    // 대화 전체를 여기서 한 번에 서버로 올린다.
    // 버블이 없으면(마이크만 켰다 끈 경우) 스토어가 만들어둔 빈 대화를 지운다.
    const savedBubbles = bubbles;
    const result = await endConversation(
      savedBubbles.map(({ direction, inputType, content }) => ({
        direction,
        inputType,
        content,
      })),
    );

    if (!result) return;

    void queryClient.invalidateQueries({
      queryKey: CONVERSATION_LIST_QUERY_KEY,
    });

    // 화면을 비워 다음 대화를 새로 시작한다.
    removeSavedBubbles(savedBubbles.length);

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
    locationName,
    isLocationConsentOpen,
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
    handleLocationConsentConfirm,
    handleLocationConsentCancel,
    handleDraftReplyChange,
    handleDraftListeningChange,
    handleSubmitReply,
    handleSubmitListening,
    handleEndConversation,
  };
};
