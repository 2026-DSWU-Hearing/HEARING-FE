import { useEffect, useRef } from 'react';

import ChatContainer from '@/pages/communication/components/chat/ChatContainer';
import ChatHistoryList from '@/pages/communication/components/chat/ChatHistoryList';
import CommunicationHeader from '@/pages/communication/components/CommunicationHeader';
import ConversationSavedNotice from '@/pages/communication/components/ConversationSavedNotice';
import RecordingButton from '@/pages/communication/components/control/RecordingButton';
import FavoriteAnswerModal from '@/pages/communication/components/favoriteAnswer/FavoriteAnswerModal';
import { useCommunicationPage } from '@/pages/communication/hooks/useCommunicationPage';

const Communication = () => {
  const {
    conversation,
    bubbles,
    isListening,
    sttErrorMessage,
    draftReply,
    draftListening,
    isSavedNoticeOpen,
    isFavoriteAnswerOpen,
    handleOpenHistory,
    handleOpenFavoriteAnswer,
    handleCloseFavoriteAnswer,
    handleSelectFavoriteAnswer,
    handleToggleRecording,
    handleDraftReplyChange,
    handleDraftListeningChange,
    handleSubmitReply,
    handleSubmitListening,
    handleEndConversation,
  } = useCommunicationPage();

  // 대화기록 스크롤 영역. 새 버블이 추가될 때마다 맨 아래로 스크롤해서, 스크롤이 위로
  // 올라가 있어도(지난 대화 보는 중) 방금 보낸 메시지가 화면 밖에 묻히지 않게 한다.
  const historyScrollRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const historyScroll = historyScrollRef.current;
    if (!historyScroll) return;

    historyScroll.scrollTop = historyScroll.scrollHeight;
  }, [bubbles]);

  if (!conversation) {
    return (
      <div className="body-base-medium flex min-h-dvh items-center justify-center bg-neutral-950 text-secondary">
        로딩 중...
      </div>
    );
  }

  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-neutral-950">
      <CommunicationHeader
        locationName={conversation.locationName}
        onOpenHistory={handleOpenHistory}
        onOpenFavoriteAnswer={handleOpenFavoriteAnswer}
      />

      {/* 대화기록만 스크롤되는 영역. 기본 입력 버블 쌍은 이 밖에 따로 고정 배치해서
          위로 스크롤해도 항상 화면 하단에 그대로 보이게 한다. */}
      <section
        ref={historyScrollRef}
        className="hide-scrollbar flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto pb-xs"
      >
        <ChatHistoryList bubbles={bubbles} />
      </section>

      {/* 대화기록이 하단 고정 영역 경계에서 딱 잘려 보이지 않도록 위를 덮는 페이드 층.
          음수 margin으로 레이아웃 높이는 0이라 아래 요소들의 위치는 그대로 두고,
          스크롤 영역의 마지막 구간 위에만 겹쳐 그린다.
          위 section의 pb와 이 층의 높이는 항상 같은 값이어야 한다 - 페이드가 더 크면
          맨 아래 최신 버블이 이 층에 물려 흐려진다. */}
      <div
        aria-hidden="true"
        className="pointer-events-none -mt-xs h-xs shrink-0 bg-gradient-to-b from-transparent to-neutral-950"
      />

      <ChatContainer
        isListening={isListening}
        draftReply={draftReply}
        draftListening={draftListening}
        onDraftReplyChange={handleDraftReplyChange}
        onDraftListeningChange={handleDraftListeningChange}
        onSubmitReply={handleSubmitReply}
        onSubmitListening={handleSubmitListening}
      />

      {/* pt-xs: 입력 버블 쌍과의 간격. 버블 사이 간격과 같은 값으로 맞춘다. */}
      <div className="flex shrink-0 items-center justify-center px-base pb-[6.1875rem] pt-xs">
        <RecordingButton
          isRecording={isListening}
          onToggle={handleToggleRecording}
          onEndConversation={handleEndConversation}
          errorMessage={sttErrorMessage}
        />
      </div>

      {isFavoriteAnswerOpen && (
        <FavoriteAnswerModal
          onClose={handleCloseFavoriteAnswer}
          onSelect={handleSelectFavoriteAnswer}
        />
      )}

      <ConversationSavedNotice isOpen={isSavedNoticeOpen} />
    </main>
  );
};

export default Communication;
