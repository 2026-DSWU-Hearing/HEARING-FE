import type { ChangeEvent } from 'react';

interface HapticSliderPropTypes {
  /** 현재 값 (0~100) */
  value: number;
  /** 값 변경 핸들러 */
  onChange: (value: number) => void;
  /** 왼쪽 끝 라벨 */
  minLabel?: string;
  /** 오른쪽 끝 라벨 */
  maxLabel?: string;
}

/**
 * 진동 강도 등에 사용하는 range 슬라이더.
 * 채워진 트랙(왼쪽)은 value 비율만큼 노란색, 나머지는 회색으로 표시한다.
 * 상단에 [약함 / 값% / 강함] 라벨을 둔다.
 */
const HapticSlider = ({
  value,
  onChange,
  minLabel = '약함',
  maxLabel = '강함',
}: HapticSliderPropTypes) => {
  const handleSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(event.target.value));
  };

  // value 지점까지 노랑(primary), 이후 회색(neutral-700)으로 트랙을 채운다.
  const trackBackground = `linear-gradient(to right, var(--color-primary-500) 0%, var(--color-primary-500) ${value}%, var(--color-neutral-700) ${value}%, var(--color-neutral-700) 100%)`;

  return (
    <div className="flex flex-col gap-sm">
      <div className="flex items-center justify-between">
        <span className="heading-base-semibold text-tertiary">{minLabel}</span>
        <span className="heading-base-semibold text-secondary">{value}%</span>
        <span className="heading-base-semibold text-tertiary">{maxLabel}</span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={handleSliderChange}
        aria-label="진동 강도"
        className="range-slider"
        style={{ background: trackBackground }}
      />
    </div>
  );
};

export default HapticSlider;
