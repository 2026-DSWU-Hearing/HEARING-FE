import LiveSoundIcon from '@/shared/components/icons/LiveSoundIcon';

interface LiveSoundAnimationPropTypes {
  isListening: boolean;
}

// 원 크기는 min(maxRem, ratio)로 반응형 처리한다.
// 넓은 화면에선 maxRem(고정 크기), 컨테이너가 좁아지면 ratio(컨테이너 너비 비율)가 선택돼 함께 줄어든다.
// ratio는 가장 바깥 링을 컨테이너 너비의 96%로 두고, 원들의 상대 비율(maxRem 기준)을 유지하도록 환산했다.
const getResponsiveSize = (maxRem: number, ratio: string) =>
  `min(${maxRem}rem, ${ratio})`;

// 아이콘을 감싸는 바깥쪽 링 2개. 안→밖 순서로 크기를 키운다.
// 감지 중에는 각 링이 delay를 두고 빛나며 안쪽에서 바깥으로 파동이 흐른다.
const OUTLINE_RING_LIST = [
  { maxRem: 16, ratio: '71.4%', delay: '0.4s' },
  { maxRem: 21.5, ratio: '96%', delay: '0.8s' },
];

// 가장 안쪽 배경 원과 아이콘도 같은 기준으로 반응형 크기를 갖는다.
const BACKGROUND_CIRCLE_SIZE = getResponsiveSize(10.75, '48%');
const ICON_SIZE = getResponsiveSize(5.5, '24.6%');

// 링의 좌우 측면을 빛나게 하는 그라데이션 (LoadingSpinner와 동일한 좌우 글로우 방식).
// 오른쪽 가장자리(at 100% 50%)와 왼쪽 가장자리(at 0% 50%)에서 빛이 나며, 상하로도 부드럽게 번진다.
const SIDE_GLOW_BACKGROUND =
  'radial-gradient(circle at 100% 50%, color-mix(in srgb, var(--color-primary-300) 60%, transparent) 0%, transparent 48%), radial-gradient(circle at 0% 50%, color-mix(in srgb, var(--color-primary-300) 60%, transparent) 0%, transparent 48%)';

// 안쪽을 잘라내 바깥 테두리 띠에만 빛이 보이게 하는 도넛 마스크.
// 안쪽 58%는 가려지고(transparent) 바깥 72%부터 보여(black), 빛이 원을 채우지 않고 외곽선처럼 남는다.
const RING_MASK = 'radial-gradient(circle, transparent 58%, black 72%)';

const RING_MASK_STYLE = {
  WebkitMaskImage: RING_MASK,
  maskImage: RING_MASK,
};

const LiveSoundAnimation = ({ isListening }: LiveSoundAnimationPropTypes) => {
  return (
    <div
      className="relative flex aspect-square w-full items-center justify-center"
      style={{ maxHeight: '21.75rem', maxWidth: '21.75rem' }}
    >
      {/* 원 뒤 은은하게 떠다니는 노란 보케 - 좌우로 흐릿하게 번지는 빛무리.
          컨테이너보다 살짝 크게(120%) 퍼지되 화면 폭에 비례하도록 반응형으로 둔다. */}
      {isListening && (
        <span
          className="absolute blur-[3rem]"
          style={{
            width: '120%',
            height: '92%',
            background:
              'radial-gradient(40% 45% at 22% 50%, color-mix(in srgb, var(--color-primary-400) 22%, transparent) 0%, transparent 100%), radial-gradient(40% 45% at 78% 50%, color-mix(in srgb, var(--color-primary-400) 22%, transparent) 0%, transparent 100%)',
          }}
        />
      )}

      {/* 바깥 링 2개 */}
      {OUTLINE_RING_LIST.map(({ maxRem, ratio, delay }) => {
        const size = getResponsiveSize(maxRem, ratio);

        return isListening ? (
          // 감지 중: 좌우 측면만 빛나는 골드 링. 도넛 마스크로 테두리 띠에만 빛을 남기고
          // delay로 안→밖 순차 글로우를 만든다.
          <span
            key={maxRem}
            className="animate-sound-wave absolute rounded-full"
            style={{
              width: size,
              height: size,
              animationDelay: delay,
              background: SIDE_GLOW_BACKGROUND,
              ...RING_MASK_STYLE,
            }}
          />
        ) : (
          // 감지 전: 정적인 회색 선 링
          <span
            key={maxRem}
            className="absolute rounded-full border border-neutral-600"
            style={{ width: size, height: size }}
          />
        );
      })}

      {/* 아이콘 뒷배경 원 - 감지 중에는 테두리 좌우만 빛나는 가장 안쪽 링이 된다.
          감지 전 배경은 피그마 값(중심 투명 → 가장자리 neutral-700, opacity 0.35)을 재현한다. */}
      <span
        className={`absolute rounded-full ${
          isListening
            ? 'animate-sound-wave'
            : 'bg-[radial-gradient(circle,transparent_41.8%,color-mix(in_srgb,var(--color-neutral-700)_35%,transparent)_100%)]'
        }`}
        style={{
          width: BACKGROUND_CIRCLE_SIZE,
          height: BACKGROUND_CIRCLE_SIZE,
          ...(isListening
            ? { background: SIDE_GLOW_BACKGROUND, ...RING_MASK_STYLE }
            : {}),
        }}
      />

      {/* 공용 LiveSoundIcon은 style을 받지 않으므로, 반응형 크기는 래퍼 span이 갖고
          아이콘은 부모를 가득 채우게 한다. */}
      <span
        className={`relative z-10 transition-colors duration-500 ${
          isListening
            ? 'text-primary-50 drop-shadow-[0_0_18px_rgba(255,249,212,0.9)]'
            : 'text-neutral-400'
        }`}
        style={{ width: ICON_SIZE, height: ICON_SIZE }}
      >
        <LiveSoundIcon className="h-full w-full" />
      </span>
    </div>
  );
};

export default LiveSoundAnimation;
