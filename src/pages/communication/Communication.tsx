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
    // h-dvh(고정 높이) + overflow-hidden: 채팅 내용이 길어져도 main 자체는 화면 높이를 벗어나지
    // 않는다. 그래야 아래 section의 overflow-y-auto가 내부적으로만 스크롤되고,
    // 헤더/하단 버튼 줄이 화면 스크롤에 밀려 움직이지 않는다.
    <main className="flex h-dvh flex-col overflow-hidden bg-neutral-950">
      <CommunicationHeader
        locationName={conversation.locationName}
        onOpenHistory={handleOpenHistory}
        onOpenFavoriteAnswer={handleOpenFavoriteAnswer}
      />

      {/* min-h-0: flex item 기본값(min-height:auto)이 내용 크기만큼 자라려는 걸 막아야
          overflow-y-auto가 실제로 내부 스크롤로 동작한다(안 그러면 section 자체가 늘어나
          main 전체가 길어지고, 그 여파로 헤더가 위로 밀려 올라간다). */}
      <section className="flex min-h-0 flex-1 flex-col justify-end overflow-y-auto">
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

      {/* 하단 탭바(BottomNavigation)가 h-[5.1875rem]짜리 fixed라 문서 흐름엔 안 잡혀서,
          "탭바 위 2.81rem"을 만들려면 탭바 높이(5.1875rem)까지 더해서 띄워야 한다. */}
      <div className="flex shrink-0 items-center justify-center px-base pb-[7.9975rem] pt-base">
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
