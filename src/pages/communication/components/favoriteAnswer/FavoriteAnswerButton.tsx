import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface FavoriteAnswerButtonPropTypes {
  onClick: () => void;
}


const FavoriteAnswerButton = ({ onClick }: FavoriteAnswerButtonPropTypes) => {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="heading-base-semibold flex w-full items-center gap-xs rounded-lg px-sm py-xs text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
    >
      <FontAwesomeIcon icon={faPen} className="h-icon-sm w-icon-sm" />
      자주 쓰는 답변
    </button>
  );
};

export default FavoriteAnswerButton;
