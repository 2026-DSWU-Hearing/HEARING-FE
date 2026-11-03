import { useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';

import ChatHistoryList from '@/pages/communication/components/chat/ChatHistoryList';
import ConversationHistoryInfo from '@/pages/communication/components/history/ConversationHistoryInfo';
import { CONVERSATION_HISTORY_MESSAGE } from '@/pages/communication/constants/conversationHistoryMessages';
import { useGetConversation } from '@/pages/communication/hooks/useGetConversation';
import type { ChatBubbleTypes } from '@/pages/communication/types/communicationTypes';
import TopNavigation from '@/layout/TopNavigation';
import QueryErrorState from '@/shared/components/QueryErrorState';

const MESSAGE_CLASSNAME = 'body-sm-regular mt-lg text-center text-neutral-500';

const ConversationHistoryDetailPage = () => {
  const { historyId } = useParams();
  const conversationId = Number(historyId);
  const isValidId = Number.isInteger(conversationId) && conversationId > 0;

  const {
    data: conversation,
    isPending,
    isError,
    error,
    isFetching,
    refetch,
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

  const isNotFound =
    !isValidId || (isAxiosError(error) && error.response?.status === 404);
  const isLoading = isValidId && isPending;

  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-neutral-950">
      <TopNavigation
        title={CONVERSATION_HISTORY_MESSAGE.TITLE}
        bottomSpacing="compact"
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
        {isError && !isNotFound && (
          <QueryErrorState
            message="대화 기록을 불러오지 못했습니다"
            isRetrying={isFetching}
            onRetry={() => void refetch()}
          />
        )}
      </section>
    </main>
  );
};

export default ConversationHistoryDetailPage;
