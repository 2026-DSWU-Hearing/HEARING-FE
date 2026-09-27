import { useParams } from 'react-router-dom';

import ChatHistoryList from '@/pages/communication/components/chat/ChatHistoryList';
import ConversationHistoryInfo from '@/pages/communication/components/history/ConversationHistoryInfo';
import { CONVERSATION_HISTORY_MESSAGE } from '@/pages/communication/constants/conversationHistoryMessages';
import { useGetConversation } from '@/pages/communication/hooks/useGetConversation';
import type { ChatBubbleTypes } from '@/pages/communication/types/communicationTypes';
import { formatConversationDate } from '@/pages/communication/utils/formatConversationDate';
import TopNavigation from '@/layout/TopNavigation';

const MESSAGE_CLASSNAME = 'body-sm-regular mt-lg text-center text-neutral-500';

const ConversationHistoryDetailPage = () => {
  const { historyId } = useParams();
  const conversationId = Number(historyId);
  const isValidId = Number.isInteger(conversationId) && conversationId > 0;

  const {
    data: conversation,
    isPending,
    isError,
  } = useGetConversation(conversationId);

  const bubbles: ChatBubbleTypes[] =
    conversation?.bubbles.map(
      ({ bubble_id: id, direction, inputType, content }) => ({
        id,
        direction,
        inputType,
        content,
      }),
    ) ?? [];

  const isNotFound = !isValidId || isError;
  const isLoading = isValidId && isPending;

  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-neutral-950">
      <TopNavigation
        title={
          conversation ? formatConversationDate(conversation.created_at) : ''
        }
      />

      <section className="hide-scrollbar flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto pb-[6.1875rem]">
        {conversation && (
          <>
            <ConversationHistoryInfo
              startedAt={conversation.created_at}
              latitude={conversation.latitude}
              longitude={conversation.longitude}
            />
            <ChatHistoryList bubbles={bubbles} />
          </>
        )}

        {isLoading && (
          <p role="status" className={MESSAGE_CLASSNAME}>
            {CONVERSATION_HISTORY_MESSAGE.LOADING}
          </p>
        )}

        {isNotFound && (
          <p className={MESSAGE_CLASSNAME}>
            {CONVERSATION_HISTORY_MESSAGE.NOT_FOUND}
          </p>
        )}
      </section>
    </main>
  );
};

export default ConversationHistoryDetailPage;
