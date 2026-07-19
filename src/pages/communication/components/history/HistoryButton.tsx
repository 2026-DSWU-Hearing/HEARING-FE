import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface HistoryButtonPropTypes {
  onClick: () => void;
}

// 헤더 우측 '더보기' 메뉴 안에 들어가는 항목. 대화기록 리스트 화면은 아직 없어서
// 클릭 핸들러는 상위(useCommunicationPage)에서 임시로 콘솔 로그만 남긴다.
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
