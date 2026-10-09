import EllipsisIcon from '@/shared/components/icons/EllipsisIcon';

interface CommunicationMenuButtonPropTypes {
  isOpen: boolean;
  onClick: () => void;
}

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
