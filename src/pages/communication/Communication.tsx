import { useEffect, useState } from 'react';

import CommunicationHeader from '@/pages/communication/components/CommunicationHeader';
import ChatContainer from '@/pages/communication/components/chat/ChatContainer';
import ConversationEndButton from '@/pages/communication/components/control/ConversationEndButton';
import RecordingButton from '@/pages/communication/components/control/RecordingButton';
import type { ConversationTypes } from '@/pages/communication/types/communication-Types';

interface CommunicationMockDataTypes {
  conversation: ConversationTypes;
}

const Communication = () => {
  const [conversation, setConversation] = useState<ConversationTypes | null>(
    null,
  );
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const fetchMockData = async () => {
      const response = await fetch('/data/communicationMock.json');
      const data: CommunicationMockDataTypes = await response.json();

      setConversation(data.conversation);
    };

    fetchMockData();
  }, []);

  const handleOpenHistory = () => {
    console.log('대화기록 열기');
  };

  const handleOpenFavoriteAnswer = () => {
    console.log('자주 쓰는 답변 열기');
  };

  const handleToggleRecording = () => {
    setIsListening((prev) => !prev);
  };

  const handleEndConversation = () => {
    console.log('대화 종료');
  };

  if (!conversation) {
    return <div className="p-4 text-sm text-gray-500">로딩 중...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <CommunicationHeader
        locationName={conversation.locationName}
        onOpenHistory={handleOpenHistory}
        onOpenFavoriteAnswer={handleOpenFavoriteAnswer}
      />

      <section className="flex flex-1 flex-col justify-end overflow-y-auto">
        <ChatContainer
          bubbles={conversation.bubbles}
          isListening={isListening}
        />
      </section>

      <div className="flex shrink-0 items-center justify-center gap-3 px-4 py-4">
        <RecordingButton
          isRecording={isListening}
          onToggle={handleToggleRecording}
        />
        <ConversationEndButton onClick={handleEndConversation} />
      </div>
    </main>
  );
};

export default Communication;
