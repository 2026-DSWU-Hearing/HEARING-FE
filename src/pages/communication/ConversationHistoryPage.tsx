import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import ConversationHistoryList from '@/pages/communication/components/history/ConversationHistoryList';
import { CONVERSATION_HISTORY_MESSAGE } from '@/pages/communication/constants/conversationHistoryMessages';
import { useGetCommunicationMock } from '@/pages/communication/hooks/useGetCommunicationMock';
import { useConversationHistoryStore } from '@/pages/communication/stores/useConversationHistoryStore';
import TopNavigation from '@/layout/TopNavigation';

const ConversationHistoryPage = () => {
  const navigate = useNavigate();
  const { data } = useGetCommunicationMock();

  const histories = useConversationHistoryStore((state) => state.histories);
  const initializeHistories = useConversationHistoryStore(
    (state) => state.initialize,
  );

  useEffect(() => {
    if (!data) return;

    initializeHistories(data.conversationHistories);
  }, [data, initializeHistories]);

  const handleSelectHistory = (id: number) => {
    navigate(`/communication/histories/${id}`);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-neutral-950 pb-[9.5rem]">
      <TopNavigation title={CONVERSATION_HISTORY_MESSAGE.TITLE} />

      <ConversationHistoryList
        histories={histories}
        onSelect={handleSelectHistory}
      />
    </div>
  );
};

export default ConversationHistoryPage;
