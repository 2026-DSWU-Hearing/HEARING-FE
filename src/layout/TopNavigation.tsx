import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

// 우측에 텍스트 대신 아이콘 버튼이 필요한 경우(예: 알림 페이지의 쓰레기통)에 사용한다.
// 아이콘 단독 버튼은 라벨이 없으면 스크린리더가 용도를 읽지 못하므로 ariaLabel 을 필수로 둔다.
interface RightIconButtonTypes {
  icon: IconDefinition;
  onClick: () => void;
  ariaLabel: string;
  colorClassName?: string;
}

interface TopNavigationPropTypes {
  title?: string;
  rightText?: string;
  onRightClick?: () => void;
  rightVariant?: 'default' | 'active';
  isRightDisabled?: boolean;
  // rightIconButton 이 있으면 rightText 보다 우선해서 렌더한다.
  rightIconButton?: RightIconButtonTypes;
  onBackClick?: () => void;
  backIconSrc?: string;
}

const TopNavigation = ({
  title = '',
  rightText,
  onRightClick,
  rightVariant = 'default',
  isRightDisabled = false,
  rightIconButton,
  onBackClick,
  backIconSrc,
}: TopNavigationPropTypes) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
      return;
    }

    navigate(-1);
  };

  const rightTextColorClassName = {
    default: 'text-primary',
    active: 'text-primary-500',
  }[rightVariant];

  return (
    <header className="mb-2xl grid w-full grid-cols-[64px_1fr_64px] items-center px-[1.03rem] pt-[2.75rem]">
      <button
        type="button"
        onClick={handleBackClick}
        aria-label="이전 페이지로 이동"
        className="aspect-square h-[32px] w-[32px] text-primary"
      >
        {backIconSrc ? (
          <img src={backIconSrc} alt="" className="h-full w-ful p-[5px]" />
        ) : (
          <FontAwesomeIcon
            icon={faAngleLeft}
            className="h-full w-full p-[5px]"
          />
        )}
      </button>

      <h1 className="text-center heading-lg-semibold text-primary">{title}</h1>

      {/* 우측 버튼이 없어도 3번째 컬럼(64px)을 차지해 제목 중앙 정렬을 유지한다.
          우선순위: 아이콘 버튼 > 텍스트 버튼 > 빈 placeholder. */}
      {rightIconButton ? (
        <button
          type="button"
          onClick={rightIconButton.onClick}
          disabled={isRightDisabled}
          aria-label={rightIconButton.ariaLabel}
          className={`justify-self-end h-[1.5rem] w-[1.5rem] disabled:text-neutral-300 ${
            rightIconButton.colorClassName ?? 'text-primary'
          }`}
        >
          <FontAwesomeIcon icon={rightIconButton.icon} />
        </button>
      ) : rightText && onRightClick ? (
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
