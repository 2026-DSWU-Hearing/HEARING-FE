import ConversationHistoryItem from '@/pages/communication/components/history/ConversationHistoryItem';
import { CONVERSATION_HISTORY_MESSAGE } from '@/pages/communication/constants/conversationHistoryMessages';
import type { ConversationHistoryDetailTypes } from '@/pages/communication/types/communication-Types';

interface ConversationHistoryListPropTypes {
  histories: ConversationHistoryDetailTypes[];
  onSelect: (id: number) => void;
}

const ConversationHistoryList = ({
  histories,
  onSelect,
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
          onClick={() => onSelect(history.id)}
        />
      ))}
    </div>
  );
};

export default ConversationHistoryList;
