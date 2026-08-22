import { getCategoryColor } from '@/pages/home/constants/categoryColors';
import {
  formatNotificationAbsoluteTime,
  formatNotificationRelativeTime,
} from '@/pages/home/utils/formatNotificationTime';
import SoundIconView from '@/shared/components/icons/sounds/SoundIconView';

import type { DetectionTypes } from '@/shared/types/detectionTypes';

interface NotificationBarPropTypes {
  notification: DetectionTypes;
  currentTime: number;
  isDeleteMode?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  onSelect?: (id: number) => void;
}

const NotificationBar = ({
  notification,
  currentTime,
  isDeleteMode = false,
  isSelected = false,
  isDisabled = false,
  onSelect,
}: NotificationBarPropTypes) => {
  const {
    id,
    sound_name: soundName,
    sound_category: category,
    detected_at: detectedAt,
  } = notification;
  const relativeTime = formatNotificationRelativeTime(detectedAt, currentTime);
  const absoluteTime = formatNotificationAbsoluteTime(detectedAt);

  const handleSelectClick = () => {
    onSelect?.(id);
  };

  // 카드 배경 색 분기:
  // - 삭제모드 + 선택됨: 앰버색 20% 투명 배경 + 회색 테두리(스크린샷의 선택 행).
  // - 그 외: 기본 어두운 톤.
  const cardStyle =
    isDeleteMode && isSelected
      ? 'bg-[#DF9A00]/20 border border-neutral-600'
      : 'bg-neutral-900 border border-transparent';

  const cardClassName = `flex w-full items-center gap-base rounded-xl px-sm py-sm text-left transition-colors duration-200 ease-out ${cardStyle}`;

  // 아이콘 + 소리명 + 카테고리 + 시간. wrapper(button/div)와 무관하게 동일하다.
  const cardContent = (
    <>
      {/* 좌측 소리 아이콘 */}
      <SoundIconView
        soundName={soundName}
        categoryName={category}
        className="h-[2.5rem] w-[2.5rem] shrink-0 text-[2rem] leading-none text-primary"
      />

      {/* 가운데: 소리명 + 카테고리 배지 */}
      <div className="flex min-w-0 flex-1 flex-col gap-xxs">
        <span className="body-lg-regular truncate text-primary">
          {soundName}
        </span>
        <span
          className={`caption-xs-medium w-fit whitespace-nowrap rounded-full px-xs py-xxxs shadow-chip ${getCategoryColor(
            category,
          )}`}
        >
          {category}
        </span>
      </div>

      {/* 우측: 상대 시간 / 절대 시간 */}
      <div className="flex shrink-0 flex-col items-end gap-xs text-right">
        <span className="body-sm-regular text-primary">{relativeTime}</span>
        <span className="body-sm-regular text-neutral-400">{absoluteTime}</span>
      </div>
    </>
  );

  // 일반 모드에서는 클릭 동작이 없으므로(추후 상세 이동 TODO) button 대신 비상호작용 div 로 렌더해
  // 스크린리더/키보드 사용자가 '버튼'으로 오인하지 않도록 한다.
  // TODO(api): 일반 모드 클릭으로 알림 상세/감지 위치 이동이 생기면 다시 button/Link 로 바꾼다.
  if (!isDeleteMode) {
    return (
      <div className={`${cardClassName} cursor-default`}>{cardContent}</div>
    );
  }

  // 삭제 모드: 선택 토글이 가능하므로 button + aria-pressed 로 선택 상태를 노출한다.
  return (
    <button
      type="button"
      onClick={handleSelectClick}
      disabled={isDisabled}
      aria-pressed={isSelected}
      className={`${cardClassName} cursor-pointer disabled:cursor-wait disabled:opacity-60`}
    >
      {cardContent}
    </button>
  );
};

export default NotificationBar;
