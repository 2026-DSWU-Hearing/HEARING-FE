import EllipsisIcon from '@/shared/components/icons/EllipsisIcon';

interface CommunicationMenuButtonPropTypes {
  isOpen: boolean;
  onClick: () => void;
}

// 헤더 우측의 '더보기(...)' 버튼. 누르면 대화기록/자주 쓰는 답변 메뉴가 펼쳐진다.
// 메뉴가 열려있는 동안(isOpen)에는 점 색이 한 톤 어둡게 바뀌어 눌린 상태를 나타낸다.
const CommunicationMenuButton = ({
  isOpen,
  onClick,
}: CommunicationMenuButtonPropTypes) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="대화 옵션 더보기"
      className="flex h-2xl w-2xl shrink-0 items-center justify-center rounded-2xl bg-neutral-700 p-sm"
    >
      <EllipsisIcon
        className={`h-icon-md w-icon-md shrink-0 ${isOpen ? 'text-tertiary' : 'text-secondary'}`}
      />
    </button>
  );
};

export default CommunicationMenuButton;
