import ChatContainer from '@/pages/communication/components/chat/ChatContainer';
import CommunicationHeader from '@/pages/communication/components/CommunicationHeader';
import ConversationSavedNotice from '@/pages/communication/components/ConversationSavedNotice';
import ConversationEndButton from '@/pages/communication/components/control/ConversationEndButton';
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
    handleEndConversation,
  } = useCommunicationPage();

  if (!conversation) {
    return (
      <div className="body-base-medium flex min-h-dvh items-center justify-center bg-neutral-950 text-secondary">
        로딩 중...
      </div>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col bg-neutral-950">
      <CommunicationHeader
        locationName={conversation.locationName}
        onOpenHistory={handleOpenHistory}
        onOpenFavoriteAnswer={handleOpenFavoriteAnswer}
      />

      <section className="flex flex-1 flex-col justify-end overflow-y-auto">
        <ChatContainer
          bubbles={bubbles}
          isListening={isListening}
          draftReply={draftReply}
          draftListening={draftListening}
          onDraftReplyChange={handleDraftReplyChange}
          onDraftListeningChange={handleDraftListeningChange}
          onSubmitReply={handleSubmitReply}
        />
      </section>

      {/* 하단 탭바(BottomNavigation)가 h-[5.1875rem]짜리 fixed라 문서 흐름엔 안 잡혀서,
          "탭바 위 2.81rem"을 만들려면 탭바 높이(5.1875rem)까지 더해서 띄워야 한다. */}
      <div className="flex shrink-0 items-center justify-center gap-xl px-base pb-[7.9975rem] pt-base">
        <RecordingButton
          isRecording={isListening}
          onToggle={handleToggleRecording}
        />
        {isListening && (
          <ConversationEndButton onClick={handleEndConversation} />
        )}
      </div>

      <ConversationSavedNotice isOpen={isSavedNoticeOpen} />
    </main>
  );
};

export default Communication;
