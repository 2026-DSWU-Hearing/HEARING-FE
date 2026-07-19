import ChatContainer from '@/pages/communication/components/chat/ChatContainer';
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

      <section className="flex min-h-0 flex-1 flex-col justify-end overflow-x-hidden overflow-y-auto">
        <ChatContainer
          bubbles={bubbles}
          isListening={isListening}
          draftReply={draftReply}
          draftListening={draftListening}
          onDraftReplyChange={handleDraftReplyChange}
          onDraftListeningChange={handleDraftListeningChange}
          onSubmitReply={handleSubmitReply}
          onSubmitListening={handleSubmitListening}
        />
      </section>

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
