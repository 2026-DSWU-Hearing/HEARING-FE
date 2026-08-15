import { useEffect, useRef } from 'react';

import ChatContainer from '@/pages/communication/components/chat/ChatContainer';
import ChatHistoryList from '@/pages/communication/components/chat/ChatHistoryList';
import CommunicationHeader from '@/pages/communication/components/CommunicationHeader';
import ConversationSavedNotice from '@/pages/communication/components/ConversationSavedNotice';
import RecordingButton from '@/pages/communication/components/control/RecordingButton';
import { useCommunicationPage } from '@/pages/communication/hooks/useCommunicationPage';

const Communication = () => {
  const {
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
        className="hide-scrollbar flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto"
      >
        <ChatHistoryList bubbles={bubbles} />
      </section>

      <ChatContainer
        isListening={isListening}
        draftReply={draftReply}
        draftListening={draftListening}
        onDraftReplyChange={handleDraftReplyChange}
        onDraftListeningChange={handleDraftListeningChange}
        onSubmitReply={handleSubmitReply}
        onSubmitListening={handleSubmitListening}
      />

      <div className="flex shrink-0 items-center justify-center px-base pb-[6.1875rem] pt-base">
        <RecordingButton
          isRecording={isListening}
          onToggle={handleToggleRecording}
          onEndConversation={handleEndConversation}
        />
      </div>

      <ConversationSavedNotice isOpen={isSavedNoticeOpen} />
    </main>
  );
};

export default Communication;
