import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

export interface SettingCardHeaderPropTypes {
  /** 왼쪽에 표시할 대표 아이콘 */
  icon: IconDefinition;
  /** 작은 라벨 (예: 기기 이름) */
  label: string;
  /** 굵은 제목 (예: ESP32) */
  title: string;
  /** 우측 편집(연필) 버튼 클릭 핸들러. 전달하지 않으면 연필을 렌더하지 않는다. */
  onEdit?: () => void;
}

// 설정 카드 상단 공통 헤더.
// [아이콘] [라벨 / 제목] ... [연필]
// 나의 디바이스·진동 강도 설정 등 동일한 카드 골격에서 재사용한다.

const SettingCardHeader = ({
  icon,
  label,
  title,
  onEdit,
}: SettingCardHeaderPropTypes) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex min-w-0 items-center gap-base">
        <FontAwesomeIcon
          icon={icon}
          className="h-icon-md w-icon-md shrink-0 text-tertiary"
        />
        <div className="flex min-w-0 flex-col gap-xxxs">
          <span className="body-small-regular text-secondary">{label}</span>
          <span className="heading-lg-semibold truncate text-primary">
            {title}
          </span>
        </div>
      </div>

      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          aria-label={`${label} 편집`}
          className="shrink-0"
        >
          <FontAwesomeIcon
            icon={faPen}
            className="h-icon-sm w-icon-sm text-tertiary"
          />
        </button>
      )}
    </div>
  );
};

export default SettingCardHeader;
