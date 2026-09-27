import type { RefObject } from 'react';

import ConversationHistoryItem from '@/pages/communication/components/history/ConversationHistoryItem';
import { CONVERSATION_HISTORY_MESSAGE } from '@/pages/communication/constants/conversationHistoryMessages';
import type { ConversationListItemTypes } from '@/pages/communication/types/conversationApiTypes';

interface ConversationHistoryListPropTypes {
  histories: ConversationListItemTypes[];
  isDeleteMode: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isFetchNextPageError: boolean;
  loadMoreRef: RefObject<HTMLDivElement | null>;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  onLoadMoreRetry: () => void;
}

const MESSAGE_CLASSNAME =
  'body-sm-regular py-base text-center text-neutral-500';

const ConversationHistoryList = ({
  histories,
  isDeleteMode,
  hasNextPage,
  isFetchingNextPage,
  isFetchNextPageError,
  loadMoreRef,
  onSelect,
  onDelete,
  onLoadMoreRetry,
}: ConversationHistoryListPropTypes) => {
  if (histories.length === 0 && !hasNextPage && !isFetchingNextPage) {
    return (
      <p className="body-sm-regular mt-lg text-center text-neutral-500">
        {CONVERSATION_HISTORY_MESSAGE.EMPTY}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-sm px-base">
      {histories.map((history) => (
        <ConversationHistoryItem
          key={history.conversation_id}
          history={history}
          isDeleteMode={isDeleteMode}
          onClick={() => onSelect(history.conversation_id)}
          onDelete={() => onDelete(history.conversation_id)}
        />
      ))}

      {hasNextPage && !isFetchNextPageError && (
        <div ref={loadMoreRef} className="min-h-12" aria-hidden="true" />
      )}

      {isFetchingNextPage && (
        <p role="status" className={MESSAGE_CLASSNAME}>
          {CONVERSATION_HISTORY_MESSAGE.LOADING_MORE}
        </p>
      )}

      {isFetchNextPageError && (
        <div role="alert" className="flex flex-col items-center gap-xs py-base">
          <p className="body-sm-regular text-neutral-500">
            {CONVERSATION_HISTORY_MESSAGE.LOAD_FAILED}
          </p>
          <button
            type="button"
            onClick={onLoadMoreRetry}
            className="body-sm-medium rounded-lg border border-neutral-600 px-base py-xs text-primary"
          >
            {CONVERSATION_HISTORY_MESSAGE.RETRY}
          </button>
        </div>
      )}
    </div>
  );
};

export default ConversationHistoryList;
