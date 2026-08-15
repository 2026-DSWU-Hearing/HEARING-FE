import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import ChatHistoryList from '@/pages/communication/components/chat/ChatHistoryList';
import { CONVERSATION_HISTORY_MESSAGE } from '@/pages/communication/constants/conversationHistoryMessages';
import { useGetCommunicationMock } from '@/pages/communication/hooks/useGetCommunicationMock';
import { useConversationHistoryStore } from '@/pages/communication/stores/useConversationHistoryStore';
import { formatConversationDate } from '@/pages/communication/utils/formatConversationDate';
import TopNavigation from '@/layout/TopNavigation';

const ConversationHistoryDetailPage = () => {
  const { historyId } = useParams();
  const { data } = useGetCommunicationMock();

  const histories = useConversationHistoryStore((state) => state.histories);
  const isInitialized = useConversationHistoryStore(
    (state) => state.isInitialized,
  );
  const initializeHistories = useConversationHistoryStore(
    (state) => state.initialize,
  );

  useEffect(() => {
    if (!data) return;

    initializeHistories(data.conversationHistories);
  }, [data, initializeHistories]);

  const history = histories.find(({ id }) => id === Number(historyId));

  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-neutral-950">
      <TopNavigation
        title={history ? formatConversationDate(history.startedAt) : ''}
      />

      <section className="hide-scrollbar flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto pb-[6.1875rem]">
        {history && <ChatHistoryList bubbles={history.bubbles} />}

        {isInitialized && !history && (
          <p className="body-sm-regular mt-lg text-center text-neutral-500">
            {CONVERSATION_HISTORY_MESSAGE.NOT_FOUND}
          </p>
        )}
      </section>
    </main>
  );
};

export default ConversationHistoryDetailPage;
