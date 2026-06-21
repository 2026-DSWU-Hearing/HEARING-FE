import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface DeviceStatusCardPropTypes {
  /** 상태 아이콘 (예: 배터리, 와이파이) */
  icon: IconDefinition;
  /** 상태 라벨 (예: 배터리, 연결 상태) */
  label: string;
  /** 상태 값 (예: 80%, 연결됨) */
  value: string;
  /** 값 텍스트에 추가할 클래스 (예: 연결됨=text-state-success) */
  valueClassName?: string;
}

/**
 * 디바이스 상태(배터리·연결 상태 등)를 보여주는 작은 칩 카드.
 * 디바이스 카드 본문에서 2열로 나열한다.
 */
const DeviceStatusCard = ({
  icon,
  label,
  value,
  valueClassName = 'text-secondary',
}: DeviceStatusCardPropTypes) => {
  return (
    <div className="flex flex-row gap-sm rounded-lg bg-neutral-800 px-base py-sm">
      <FontAwesomeIcon
        icon={icon}
        className="text-[1.2rem] shrink-0 text-neutral-50"
      />

      <div className="flex flex-col gap-[0.44rem]">
        <span className="heading-lg-semibold text-primary">{label}</span>

        <span className={`heading-base-semibold ${valueClassName}`}>
          {value}
        </span>
      </div>
    </div>
  );
};

export default DeviceStatusCard;
