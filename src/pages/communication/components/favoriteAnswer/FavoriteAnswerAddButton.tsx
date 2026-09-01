import { FAVORITE_ANSWER_MESSAGE } from '@/pages/communication/constants/favoriteAnswerMessages';
import PlusIcon from '@/shared/components/icons/PlusIcon';

interface FavoriteAnswerAddButtonPropTypes {
  onClick: () => void;
}

const FavoriteAnswerAddButton = ({
  onClick,
}: FavoriteAnswerAddButtonPropTypes) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={FAVORITE_ANSWER_MESSAGE.ADD}
      className="mt-xs flex h-[2.5rem] w-[2.5rem] shrink-0 items-center justify-center self-center rounded-[1.5rem] bg-primary-300/20 transition-colors active:bg-primary-300/30"
    >
      <PlusIcon className="h-[2rem] w-[2rem] text-primary-400" />
    </button>
  );
};

export default FavoriteAnswerAddButton;
