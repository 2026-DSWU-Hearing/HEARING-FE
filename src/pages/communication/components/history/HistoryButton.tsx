import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface HistoryButtonPropTypes {
  onClick: () => void;
}


const HistoryButton = ({ onClick }: HistoryButtonPropTypes) => {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="heading-base-semibold flex w-full items-center gap-xs rounded-lg px-sm py-xs text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
    >
      <FontAwesomeIcon icon={faClockRotateLeft} className="h-icon-sm w-icon-sm" />
      대화기록
    </button>
  );
};

export default HistoryButton;
