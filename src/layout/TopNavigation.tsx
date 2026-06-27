import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

interface TopNavigationPropTypes {
  title: string;
  rightText?: string;
  onRightClick?: () => void;
  rightVariant?: 'default' | 'active';
  isRightDisabled?: boolean;
}

const TopNavigation = ({
  title,
  rightText,
  onRightClick,
  rightVariant = 'default',
  isRightDisabled = false,
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
    <header className="grid w-full grid-cols-[64px_1fr_64px] items-center pt-[2.75rem] px-[1.03rem] mb-2xl">
      <button
        type="button"
        onClick={handleBackClick}
        aria-label="이전 페이지로 이동"
        className="text-primary h-[1.5rem] w-[1.5rem]"
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>

      <h1 className="text-center heading-lg-semibold text-primary">{title}</h1>

      {/* 우측 버튼이 없어도 3번째 컬럼(64px)을 차지해 제목 중앙 정렬을 유지한다. */}
      {rightText && onRightClick ? (
        <button
          type="button"
          onClick={onRightClick}
          disabled={isRightDisabled}
          className={`text-right body-lg-regular disabled:text-neutral-300 ${rightTextColorClassName}`}
        >
          {rightText}
        </button>
      ) : (
        <span aria-hidden="true" />
      )}
    </header>
  );
};

export default TopNavigation;
