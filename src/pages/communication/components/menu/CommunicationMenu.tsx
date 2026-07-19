import FavoriteAnswerButton from '@/pages/communication/components/favoriteAnswer/FavoriteAnswerButton';
import HistoryButton from '@/pages/communication/components/history/HistoryButton';
import { useEscapeKey } from '@/shared/hooks/useEscapeKey';

interface CommunicationMenuPropTypes {
  isOpen: boolean;
  onClose: () => void;
  onOpenHistory: () => void;
  onOpenFavoriteAnswer: () => void;
}

// 헤더 '...' 버튼을 누르면 뜨는 드롭다운. 대화기록/자주 쓰는 답변 두 항목만 노출한다.
// 각 항목의 실제 화면(리스트/즐겨찾기)은 아직 구현 전이라 클릭 시 메뉴만 닫고
// 상위에서 넘겨준 콜백(현재는 콘솔 로그)을 호출한다.
const CommunicationMenu = ({
  isOpen,
  onClose,
  onOpenHistory,
  onOpenFavoriteAnswer,
}: CommunicationMenuPropTypes) => {
  useEscapeKey(isOpen, onClose);

  if (!isOpen) return null;

  const handleHistoryClick = () => {
    onOpenHistory();
    onClose();
  };

  const handleFavoriteAnswerClick = () => {
    onOpenFavoriteAnswer();
    onClose();
  };

  return (
    <>
      {/* 바깥 영역을 누르면 메뉴를 닫기 위한 투명 백드롭 */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div
        role="menu"
        aria-label="대화 옵션"
        className="absolute right-0 top-full z-50 mt-xs flex w-[10rem] flex-col items-start justify-center gap-[0.625rem] rounded-xl bg-neutral-700 p-xs shadow-chip"
      >
        <HistoryButton onClick={handleHistoryClick} />
        <FavoriteAnswerButton onClick={handleFavoriteAnswerClick} />
      </div>
    </>
  );
};

export default CommunicationMenu;
