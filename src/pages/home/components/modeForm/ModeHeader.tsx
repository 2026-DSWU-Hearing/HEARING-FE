import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

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
    <header className="mt-[2.75rem] mb-[2.5rem] grid grid-cols-[48px_1fr_64px] items-center">
      <button
        type="button"
        onClick={handleBackClick}
        className="text-primary h-[1.5rem] w-[1.5rem]"
        aria-label="이전 페이지로 이동"
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>
      <h1 className="text-center heading-lg-semibold text-primary">{title}</h1>
      <button
        type="button"
        onClick={onActionClick}
        disabled={isActionDisabled}
        className="text-right body-lg-regular disabled:text-neutral-300"
      >
        {actionLabel}
      </button>
    </header>
  );
};

export default ModeHeader;
