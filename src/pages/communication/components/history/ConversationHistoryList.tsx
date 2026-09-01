import ConversationHistoryItem from '@/pages/communication/components/history/ConversationHistoryItem';
import { CONVERSATION_HISTORY_MESSAGE } from '@/pages/communication/constants/conversationHistoryMessages';
import type { ConversationHistoryDetailTypes } from '@/pages/communication/types/communication-Types';

interface ConversationHistoryListPropTypes {
  histories: ConversationHistoryDetailTypes[];
  isDeleteMode: boolean;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
}

const ConversationHistoryList = ({
  histories,
  isDeleteMode,
  onSelect,
  onDelete,
}: ConversationHistoryListPropTypes) => {
  if (histories.length === 0) {
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
          key={history.id}
          history={history}
          isDeleteMode={isDeleteMode}
          onClick={() => onSelect(history.id)}
          onDelete={() => onDelete(history.id)}
        />
      ))}
    </div>
  );
};

export default ConversationHistoryList;
