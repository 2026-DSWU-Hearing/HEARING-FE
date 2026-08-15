import { formatConversationDate } from '@/pages/communication/utils/formatConversationDate';
import type { ConversationHistoryDetailTypes } from '@/pages/communication/types/communication-Types';

interface ConversationHistoryItemPropTypes {
  history: ConversationHistoryDetailTypes;
  onClick: () => void;
}

const ConversationHistoryItem = ({
  history,
  onClick,
}: ConversationHistoryItemPropTypes) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full shrink-0 flex-col items-center gap-base self-stretch rounded-lg bg-neutral-900 p-sm transition-colors active:bg-neutral-800"
    >
      <div className="flex w-full items-center justify-between gap-base px-xxs">
        <span className="body-lg-regular truncate text-left text-primary">
          {history.title}
        </span>

        <span className="body-sm-regular shrink-0 text-right text-tertiary">
          {formatConversationDate(history.startedAt)}
        </span>
      </div>
    </button>
  );
};

export default ConversationHistoryItem;
