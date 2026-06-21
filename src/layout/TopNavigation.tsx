import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

interface TopNavigationPropTypes {
  title: string;
  rightText?: string;
  onRightClick?: () => void;
  rightVariant?: 'default' | 'active';
}

const TopNavigation = ({
  title,
  rightText,
  onRightClick,
  rightVariant = 'default',
}: TopNavigationPropTypes) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  const rightTextColorClassName = {
    default: 'text-primary',
    active: 'text-primary-500',
  }[rightVariant];

  return (
    <header className=" flex h-[1.5rem] w-full items-center justify-between pt-[2.75rem] px-[1.03rem] mb-2xl">
      <button
        type="button"
        onClick={handleBackClick}
        aria-label="이전 페이지로 이동"
        className="text-primary h-[1.5rem] w-[1.5rem]"
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>

      <h1 className="heading-lg-semibold text-primary">{title}</h1>

      {rightText && onRightClick && (
        <button
          type="button"
          onClick={onRightClick}
          className={`body-lg-regular ${rightTextColorClassName}`}
        >
          {rightText}
        </button>
      )}
    </header>
  );
};

export default TopNavigation;
