import { useNavigate } from 'react-router-dom';

interface ModeHeaderPropTypes {
  title: string;
  actionLabel: string;
  onActionClick: () => void;
  isActionDisabled?: boolean;
}

const ModeHeader = ({
  title,
  actionLabel,
  onActionClick,
  isActionDisabled = false,
}: ModeHeaderPropTypes) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <header className="mb-14 grid grid-cols-[48px_1fr_64px] items-center">
      <button
        type="button"
        onClick={handleBackClick}
        className="text-4xl leading-none"
        aria-label="이전 페이지로 이동"
      >
        ‹
      </button>
      <h1 className="text-center text-xl font-bold">{title}</h1>
      <button
        type="button"
        onClick={onActionClick}
        disabled={isActionDisabled}
        className="text-right text-lg font-bold disabled:text-neutral-300"
      >
        {actionLabel}
      </button>
    </header>
  );
};

export default ModeHeader;
