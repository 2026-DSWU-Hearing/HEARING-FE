import { useRef, useCallback } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';

interface HapticSliderPropTypes {
  /** 현재 값 (0~100) */
  value: number;
  /** 값 변경 핸들러 (드래그 중 매 프레임 호출 — 화면 즉시 반영용) */
  onChange: (value: number) => void;
  /** 값 확정 핸들러 (드래그 종료·키보드 입력 시 호출 — 저장용). 미지정 시 호출하지 않는다. */
  onChangeEnd?: (value: number) => void;
  /** 왼쪽 끝 라벨 */
  minLabel?: string;
  /** 오른쪽 끝 라벨 */
  maxLabel?: string;
}

/** thumb 지름(px). 채움 트랙 위에 thumb 중심을 맞추기 위해 left 보정에도 사용한다. */
const THUMB_SIZE = 25;

/**
 * 진동 강도 등에 사용하는 슬라이더.
 * 네이티브 input 대신 div + Pointer Events로 구현해, 트랙 inset 그림자와
 * thumb의 radial-gradient 입체감을 브라우저 일관되게 표현한다.
 * 채워진 트랙(왼쪽)은 value 비율만큼 노란색, 나머지는 회색으로 표시하고
 * 상단에 [약함 / 값% / 강함] 라벨을 둔다.
 */
const HapticSlider = ({
  value,
  onChange,
  onChangeEnd,
  minLabel = '약함',
  maxLabel = '강함',
}: HapticSliderPropTypes) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const clamp = (rawValue: number) => Math.max(0, Math.min(100, rawValue));

  // 포인터의 화면 X좌표를 트랙 기준 0~100 값으로 변환해 반환한다.
  // commit=true면 확정 핸들러(onChangeEnd)까지 호출한다(드래그 종료 시).
  const computeValue = useCallback(
    (clientX: number, commit = false) => {
      const track = trackRef.current;
      if (!track) return;

      const { left, width } = track.getBoundingClientRect();
      const ratio = ((clientX - left) / width) * 100;
      const nextValue = clamp(Math.round(ratio));

      onChange(nextValue);
      if (commit) onChangeEnd?.(nextValue);
    },
    [onChange, onChangeEnd],
  );

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    computeValue(event.clientX);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    // 좌클릭(또는 터치) 드래그 중일 때만 값 갱신.
    if (event.buttons !== 1) return;
    computeValue(event.clientX);
  };

  // 드래그를 놓는 순간 마지막 값을 확정(저장)한다.
  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    computeValue(event.clientX, true);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      const nextValue = clamp(value + 1);
      onChange(nextValue);
      onChangeEnd?.(nextValue);
    }
    if (event.key === 'ArrowLeft') {
      const nextValue = clamp(value - 1);
      onChange(nextValue);
      onChangeEnd?.(nextValue);
    }
  };

  // thumb 중심을 채움 지점에 맞추기 위해 thumb 반지름만큼 왼쪽으로 보정한다.
  const thumbLeft = `calc(${value}% - ${THUMB_SIZE / 2}px)`;

  return (
    <div className="flex w-full flex-col gap-xxs select-none">
      <div className="flex items-center justify-between">
        <span className="heading-base-semibold text-tertiary">{minLabel}</span>
        <span className="heading-base-semibold text-secondary">{value}%</span>
        <span className="heading-base-semibold text-tertiary">{maxLabel}</span>
      </div>

      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onKeyDown={handleKeyDown}
        role="slider"
        aria-label="진동 강도"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        tabIndex={0}
        className="relative h-[25px] w-full cursor-pointer"
        style={{ touchAction: 'none' }}
      >
        {/* 회색 배경 트랙 */}
        <div
          className="absolute inset-x-0 top-1/2 h-[9px] -translate-y-1/2 rounded-[4.5px]"
          style={{
            background: 'var(--color-neutral-700)',
            boxShadow: 'inset 0 4px 4px rgb(0 0 0 / 25%)',
          }}
        />

        {/* 노란색 채움 트랙 */}
        <div
          className="pointer-events-none absolute left-0 top-1/2 h-[9px] -translate-y-1/2 rounded-[4.5px]"
          style={{
            width: `${value}%`,
            background: 'var(--color-primary-600)',
          }}
        />

        {/* thumb */}
        <div
          className="pointer-events-none absolute top-1/2 h-[25px] w-[25px] -translate-y-1/2 rounded-full"
          style={{
            left: thumbLeft,
            // 시작색 #9DA095는 neutral-400/500 사이값이라 대응 토큰이 없어 hex 유지.
            background:
              'radial-gradient(circle at 38% 32%, #9DA095, var(--color-neutral-800))',
            boxShadow: '0 0 4px rgb(0 0 0 / 25%)',
          }}
        />
      </div>
    </div>
  );
};

export default HapticSlider;
