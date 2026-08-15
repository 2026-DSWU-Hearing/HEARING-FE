import { CONVERSATION_HISTORY_MESSAGE } from '@/pages/communication/constants/conversationHistoryMessages';
import type { ConversationHistoryDetailTypes } from '@/pages/communication/types/communication-Types';
import { formatConversationDate } from '@/pages/communication/utils/formatConversationDate';
import CloseIcon from '@/shared/components/icons/CloseIcon';

interface ConversationHistoryItemPropTypes {
  history: ConversationHistoryDetailTypes;
  isDeleteMode: boolean;
  onClick: () => void;
  onDelete: () => void;
}

const CARD_CLASSNAME =
  'flex w-full shrink-0 flex-col items-center gap-base self-stretch rounded-lg bg-neutral-900 p-sm';
const ROW_CLASSNAME =
  'flex w-full items-center justify-between gap-base px-xxs';
const TITLE_CLASSNAME = 'body-lg-regular truncate text-left text-primary';

const ConversationHistoryItem = ({
  history,
  isDeleteMode,
  onClick,
  onDelete,
}: ConversationHistoryItemPropTypes) => {
  if (isDeleteMode) {
    return (
      <div className={CARD_CLASSNAME}>
        <div className={ROW_CLASSNAME}>
          <span className={TITLE_CLASSNAME}>{history.title}</span>

          <button
            type="button"
            onClick={onDelete}
            aria-label={CONVERSATION_HISTORY_MESSAGE.DELETE}
            className="shrink-0"
          >
            <CloseIcon className="h-icon-md w-icon-md text-neutral-400" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${CARD_CLASSNAME} transition-colors active:bg-neutral-800`}
    >
      <div className={ROW_CLASSNAME}>
        <span className={TITLE_CLASSNAME}>{history.title}</span>

        <span className="body-sm-regular shrink-0 text-right text-tertiary">
          {formatConversationDate(history.startedAt)}
        </span>
      </div>
    </button>
  );
};

export default ConversationHistoryItem;
