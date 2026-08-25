import type { CSSProperties } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import LiveSoundIcon from '@/shared/components/icons/LiveSoundIcon';
import SoundIconView from '@/shared/components/icons/sounds/SoundIconView';

import { PRIMARY_SOUND_FADE_DURATION_SECOND } from '../constants/liveSoundDisplayConfig';
import { usePrimarySound } from '../hooks/usePrimarySound';
import { useSoundAmplitude } from '../hooks/useSoundAmplitude';
import type { SoundRateTypes } from '../types/soundRateTypes';

interface LiveSoundAnimationPropTypes {
  isListening: boolean;
  soundRateList: SoundRateTypes[];
  // 감지 중이 아니면 null. 훅이 이걸로 rAF 루프를 켜고 끈다.
  getAmplitude: (() => number) | null;
}

// 감지 영역 컨테이너의 최대 폭. 넓은 화면에서는 이 값으로 고정되고,
// 화면이 좁아지면 100%(부모 폭)가 선택돼 함께 줄어든다.
// 아래 아이콘 크기 계산이 이 값을 기준으로 삼으므로 한 곳에서만 정의한다.
const ANIMATION_CONTAINER_MAX_REM = 21.75;

// 원 크기는 min(maxRem, ratio)로 반응형 처리한다.
// 넓은 화면에선 maxRem(고정 크기), 컨테이너가 좁아지면 ratio(컨테이너 너비 비율)가 선택돼 함께 줄어든다.
// ratio는 가장 바깥 링을 컨테이너 너비의 96%로 두고, 원들의 상대 비율(maxRem 기준)을 유지하도록 환산했다.
const getResponsiveSize = (maxRem: number, ratio: string) =>
  `min(${maxRem}rem, ${ratio})`;

// 아이콘을 감싸는 바깥쪽 링 2개. 안→밖 순서로 크기를 키운다.
//
// scaleGain: 이 링이 음량에 반응하는 폭. 안쪽일수록 크게 반응해,
// 소리가 중심에서 바깥으로 밀려나가는 것처럼 보이게 한다.
// delay는 무음일 때 도는 opacity 펄스의 시차다.
const OUTLINE_RING_LIST = [
  { maxRem: 16, ratio: '71.4%', delay: '0.4s', scaleGain: 0.14 },
  { maxRem: 21.5, ratio: '96%', delay: '0.8s', scaleGain: 0.1 },
];

// 가장 안쪽 배경 원과 아이콘도 같은 기준으로 반응형 크기를 갖는다.
const BACKGROUND_CIRCLE_SIZE = getResponsiveSize(10.75, '48%');

// 중앙 아이콘의 기준 크기(대기 상태의 귀 아이콘). %의 기준은 "부모"라, 이 값을 쓰는
// 요소는 반드시 감지 영역 컨테이너의 직속 자식이어야 한다. 중간에 크기를 가진 래퍼를
// 끼우면 24.6%가 그 래퍼 기준으로 다시 계산돼 아이콘이 소리 없이 작아진다.
const ICON_SIZE = getResponsiveSize(5.5, '24.6%');

// 소리 아이콘 두 부류가 "서로 같은 크기로 보이게" 맞추는 보정.
// (귀 아이콘 대비 최종 크기는 아래 SOUND_ICON_AREA_PERCENT가 정한다.)
//
// 같은 박스를 줘도 눈에 보이는 크기는 다르다. 박스를 그림이 얼마나 채우는지가
// 아이콘 세트마다 다르기 때문이다(실측한 세로 충전율):
//   - 귀(LiveSoundIcon):  0.653  ← viewBox 36×36에 그림은 y=6.6~30.1만 차지
//   - 직접 그린 소리 SVG: 0.98~1.00 (viewBox가 그림에 딱 맞게 잘려 있음)
//   - FontAwesome 폴백:   0.875
// 즉 귀만 여백을 내장하고 있어, 보정 없이는 소리 아이콘이 1.5배쯤 커 보인다.
//
// 두 소리 아이콘 부류를 따로 맞출 수 있는 이유: 조절 수단이 서로 겹치지 않는다.
// 직접 그린 SVG는 width/height만 따르고, FontAwesome은 height:1em이 강제돼
// font-size만 따른다. 그래서 한쪽을 바꿔도 다른 쪽은 영향받지 않는다.
const HAND_DRAWN_ICON_SCALE = 0.653 / 0.98;
const FONT_AWESOME_ICON_SCALE = 0.653 / 0.875;

// 소리 아이콘이 차지하는 영역(컨테이너 폭 대비 %).
// 대기 상태 귀 아이콘(ICON_SIZE, 24.6%)보다 한 단계 작게 둔다. 감지 중에는 아이콘
// 아래에 소리 이름표가 함께 붙어 대기 화면보다 빽빽해, 배경 원 안에 여백을 남긴다.
// 24.6 × 0.85. 아래 두 부류가 공통으로 참조하므로 이 값만 바꾸면 함께 움직인다.
const SOUND_ICON_AREA_PERCENT = 20.9;

// 크기 상한도 같은 비율로 줄여, 넓은 화면과 좁은 화면의 곡선이 어긋나지 않게 한다.
const SOUND_ICON_MAX_REM = 5.5 * (SOUND_ICON_AREA_PERCENT / 24.6);

// 직접 그린 SVG용 박스 크기(width/height).
// width는 %를 쓸 수 있어 귀 아이콘과 완전히 같은 기준(컨테이너 폭)으로 잡힌다.
const SOUND_ICON_SIZE = getResponsiveSize(
  SOUND_ICON_MAX_REM * HAND_DRAWN_ICON_SCALE,
  `${(SOUND_ICON_AREA_PERCENT * HAND_DRAWN_ICON_SCALE).toFixed(1)}%`,
);

// FontAwesome 폴백용 글자 크기(font-size).
// font-size의 %는 컨테이너 너비가 아니라 "부모의 글자 크기" 기준이라 %를 쓸 수 없다.
// (그대로 주면 24.6%가 4px 남짓으로 계산돼 아이콘이 점처럼 작아진다.)
//
// 그래서 컨테이너 폭을 화면 폭으로부터 직접 환산한다. 이 페이지의 레이아웃은
//   .app(max-width: PAGE_MAX_WIDTH_REM) > main(좌우 PAGE_HORIZONTAL_PADDING_REM 패딩)
// 이라, 컨테이너 폭은 min(고정 폭, 100vw - 좌우 패딩)이 된다.
// 넓은 화면에서는 앞의 고정 rem이, 좁은 화면에서는 뒤의 calc가 선택된다.
// (24.6vw처럼 패딩을 무시하고 근사하면 좁은 화면에서 아이콘이 커진다.)
const PAGE_MAX_WIDTH_REM = 26.875;
const PAGE_HORIZONTAL_PADDING_REM = 1;
const CONTAINER_WIDTH_REM = Math.min(
  ANIMATION_CONTAINER_MAX_REM,
  PAGE_MAX_WIDTH_REM - PAGE_HORIZONTAL_PADDING_REM * 2,
);
const SOUND_ICON_AREA_RATIO = SOUND_ICON_AREA_PERCENT / 100;

const SOUND_ICON_FONT_SIZE = getResponsiveSize(
  CONTAINER_WIDTH_REM * SOUND_ICON_AREA_RATIO * FONT_AWESOME_ICON_SCALE,
  `calc((100vw - ${PAGE_HORIZONTAL_PADDING_REM * 2}rem) * ${(
    SOUND_ICON_AREA_RATIO * FONT_AWESOME_ICON_SCALE
  ).toFixed(4)})`,
);

// 소리 이름표는 아이콘 아래에 절대 배치한다. 이름 길이가 아이콘 크기에 영향을 주지 않게
// 하려는 것이고, 덕분에 아이콘이 컨테이너 직속 자식 자리를 지킬 수 있다.
const PRIMARY_LABEL_WIDTH = '12rem';

// 가장 안쪽 원이라 가장 크게 반응한다.
const BACKGROUND_CIRCLE_SCALE_GAIN = 0.18;

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

// --amp(0~1)를 실제 스케일로 번역한다. --amp-reactivity는 theme.css가 주는 전역 배율로,
// prefers-reduced-motion에서 이 값만 낮춰 반응 폭을 줄인다(0으로 죽이지는 않는다).
// rAF가 --amp만 갱신하면 링들이 각자 이 식으로 알아서 커진다.
const getAmplitudeScale = (scaleGain: number) =>
  `calc(1 + var(--amp, 0) * var(--amp-reactivity, 1) * ${scaleGain})`;

// 원 뒤 보케도 음량을 따라 밝아져, "소리가 크다"는 인상을 넓은 면적으로 전한다.
const AMPLITUDE_BOKEH_OPACITY = 'calc(0.35 + var(--amp, 0) * 0.65)';

const LiveSoundAnimation = ({
  isListening,
  soundRateList,
  getAmplitude,
}: LiveSoundAnimationPropTypes) => {
  // 마이크 음량은 이 ref가 가리키는 컨테이너의 --amp 변수로만 흐른다.
  // state를 거치지 않아 rAF가 돌아도 이 컴포넌트는 리렌더되지 않는다.
  const containerRef = useSoundAmplitude(getAmplitude);

  // 중앙에 크게 띄울 소리 하나. 히스테리시스가 걸려 있어 매 초 바뀌지 않는다.
  const primarySound = usePrimarySound(soundRateList, isListening);

  return (
    <div
      ref={containerRef}
      className="relative flex aspect-square items-center justify-center"
      // 링과 아이콘이 전부 absolute라 이 컨테이너의 폭을 밀어주는 자식이 없다.
      // 부모(LiveSoundAnimationArea)가 items-center라 폭이 stretch되지도 않아,
      // 기준 폭을 직접 정해주지 않으면 컨테이너가 0에 가깝게 줄어든다.
      style={{
        width: `${ANIMATION_CONTAINER_MAX_REM}rem`,
        maxHeight: `${ANIMATION_CONTAINER_MAX_REM}rem`,
        maxWidth: '100%',
      }}
    >
      {/* 원 뒤 은은하게 떠다니는 노란 보케 - 좌우로 흐릿하게 번지는 빛무리.
          컨테이너보다 살짝 크게(120%) 퍼지되 화면 폭에 비례하도록 반응형으로 둔다.
          보케도 음량을 따라 밝아져 "소리가 크다"는 인상을 넓은 면적으로 전한다. */}
      {isListening && (
        <span
          className="absolute blur-[3rem]"
          style={{
            width: '120%',
            height: '92%',
            opacity: AMPLITUDE_BOKEH_OPACITY,
            background:
              'radial-gradient(40% 45% at 22% 50%, color-mix(in srgb, var(--color-primary-400) 22%, transparent) 0%, transparent 100%), radial-gradient(40% 45% at 78% 50%, color-mix(in srgb, var(--color-primary-400) 22%, transparent) 0%, transparent 100%)',
          }}
        />
      )}

      {/* 바깥 링 2개 */}
      {OUTLINE_RING_LIST.map(({ maxRem, ratio, delay, scaleGain }) => {
        const size = getResponsiveSize(maxRem, ratio);

        return isListening ? (
          // 감지 중: 좌우 측면만 빛나는 골드 링. 도넛 마스크로 테두리 띠에만 빛을 남긴다.
          // 크기와 밝기가 실제 마이크 음량을 따라간다. 무음일 때도 죽어 보이지 않도록
          // 기존 opacity 펄스(animate-sound-wave)를 함께 돌린다.
          <span
            key={maxRem}
            className="animate-sound-wave absolute rounded-full"
            style={{
              width: size,
              height: size,
              animationDelay: delay,
              background: SIDE_GLOW_BACKGROUND,
              transform: `scale(${getAmplitudeScale(scaleGain)})`,
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
          가장 안쪽이라 음량에 가장 크게 반응한다.
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
            ? {
                background: SIDE_GLOW_BACKGROUND,
                transform: `scale(${getAmplitudeScale(BACKGROUND_CIRCLE_SCALE_GAIN)})`,
                ...RING_MASK_STYLE,
              }
            : {}),
        }}
      />

      {/* 중앙 아이콘. 감지된 소리가 있으면 그 소리의 아이콘과 이름으로 바뀌고,
          없으면 기본 귀 아이콘으로 돌아온다.
          key를 소리 이름으로 줘야 AnimatePresence가 "다른 것으로 교체됐다"를 인식한다. */}
      <AnimatePresence mode="wait">
        {/* 크기를 가진 요소가 컨테이너의 직속 자식이어야 %가 원 기준으로 계산된다.
            그래서 래퍼를 하나 더 두지 않고 motion.div가 직접 아이콘 크기를 갖는다.
            크기에 width/height와 font-size를 함께 주는 이유:
            직접 그린 SVG는 viewBox뿐이라 width/height로 조절되고,
            FontAwesome 폴백은 height:1em이 강제돼 font-size로만 조절된다.
            소리명에 따라 어느 쪽이 렌더될지 달라져 셋을 함께 건다.

            박스 크기를 아이콘 종류에 따라 나누는 이유는 SOUND_ICON_SCALE 주석 참고.
            같은 박스를 주면 여백이 없는 소리 아이콘이 귀보다 커 보인다. */}
        <motion.div
          key={primarySound?.id ?? 'idle'}
          className={`absolute z-10 flex items-center justify-center leading-none transition-colors duration-500 ${
            isListening
              ? 'text-primary-50 drop-shadow-[0_0_18px_rgba(255,249,212,0.9)]'
              : 'text-neutral-400'
          }`}
          style={
            {
              width: primarySound ? SOUND_ICON_SIZE : ICON_SIZE,
              height: primarySound ? SOUND_ICON_SIZE : ICON_SIZE,
              fontSize: SOUND_ICON_FONT_SIZE,
            } as CSSProperties
          }
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: PRIMARY_SOUND_FADE_DURATION_SECOND }}
        >
          {primarySound ? (
            <SoundIconView
              soundName={primarySound.label}
              categoryName={primarySound.category}
              className="h-full w-full leading-none"
            />
          ) : (
            <LiveSoundIcon className="h-full w-full" />
          )}

          {/* 소리 이름. 아이콘 아래에 절대 배치해, 이름 길이가 아이콘 크기에
              영향을 주지 않게 한다. 글자 크기는 아이콘의 font-size를 상속하면
              거대해지므로 유틸리티 클래스로 다시 잡는다. */}
          {primarySound && (
            <span
              className="heading-base-semibold absolute left-1/2 top-full mt-sm -translate-x-1/2 text-center text-primary-50"
              style={{ width: PRIMARY_LABEL_WIDTH }}
            >
              {primarySound.label}
            </span>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LiveSoundAnimation;
