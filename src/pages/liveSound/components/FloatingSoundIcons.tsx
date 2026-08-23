import type { CSSProperties } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import SoundIconView from '@/shared/components/icons/sounds/SoundIconView';

import {
  ORBIT_ICON_ENTER_DURATION_SECOND,
  ORBIT_ICON_EXIT_DURATION_SECOND,
  SOUND_ORBIT_CONFIG_LIST,
} from '../constants/soundOrbitConfig';
import type { OrbitSoundTypes } from '../types/soundRateTypes';

interface FloatingSoundIconsPropTypes {
  orbitSoundList: OrbitSoundTypes[];
}

// 감지된 소리 아이콘을 파동 링 궤도 위에 띄운다.
// 하단 SoundRateBlock의 rate(%)를 "안쪽일수록 크고 밝다"는 시각 언어로 번역해,
// 목록을 읽지 않아도 지금 무엇이 제일 크게 들리는지 한눈에 보이게 하는 것이 목적이다.
//
// 무한 루프(회전·bobbing)는 CSS keyframes로 돌린다. 이 화면은 동시에 마이크를 캡처하고
// WebSocket을 열어두기 때문에, motion으로 매 프레임 스타일을 쓰면 메인스레드를 다투게 된다.
// transform/opacity만 쓰는 CSS 애니메이션은 컴포지터 스레드에서 처리돼 훨씬 저렴하다.
// 반대로 등장/퇴장은 언마운트 타이밍 제어가 필요해 AnimatePresence가 맞다.
const FloatingSoundIcons = ({
  orbitSoundList,
}: FloatingSoundIconsPropTypes) => {
  return (
    <AnimatePresence>
      {orbitSoundList.map((sound) => {
        // 배열 위치가 아니라 slotIndex로 궤도를 고른다. 퇴장 애니메이션이 도는 동안
        // 사라진 아이콘도 계속 렌더되는데, 배열 위치를 쓰면 앞 아이콘이 빠질 때
        // 뒤 아이콘의 궤도가 당겨져 순간이동한다.
        const config = SOUND_ORBIT_CONFIG_LIST[sound.slotIndex];

        // 훅이 슬롯 번호를 설정 범위 안에서만 배정하지만, 어긋나도 화면이 깨지지 않게 막는다.
        if (!config) {
          return null;
        }

        const {
          orbitSize,
          iconSize,
          startAngle,
          orbitDuration,
          bobDuration,
          isReverse,
          colorClassName,
          glowFilter,
        } = config;

        const orbitClassName = isReverse
          ? 'animate-sound-orbit-reverse'
          : 'animate-sound-orbit';
        const counterRotateClassName = isReverse
          ? 'animate-sound-orbit-counter-reverse'
          : 'animate-sound-orbit-counter';
        const orbitDurationStyle = {
          '--orbit-duration': orbitDuration,
        } as CSSProperties;

        return (
          // 시작 각도만 고정하는 바깥 래퍼. 등장/퇴장의 opacity·scale도 여기서 다룬다.
          // id는 sound_name이라 유일함이 보장돼(mergeLiveSoundSounds) key로 안전하다.
          // 아래 목록이 같은 정보를 텍스트로 이미 제공하므로 보조기기에는 노출하지 않는다.
          <motion.div
            key={sound.id}
            className="pointer-events-none absolute"
            style={{
              width: orbitSize,
              height: orbitSize,
              rotate: `${startAngle}deg`,
            }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                duration: ORBIT_ICON_ENTER_DURATION_SECOND,
                ease: 'easeOut',
              },
            }}
            // 퇴장을 길게 끄는 것이 깜빡임 방지 장치다. 서버가 매 초 목록을 통째로
            // 교체하다 보니 같은 소리가 한 스냅샷만 빠졌다 곧바로 돌아오는 일이 잦은데,
            // 천천히 사라지는 동안 다시 등장하면 AnimatePresence가 퇴장을 취소하고
            // 원래 밝기로 되돌린다. 짧게 주면 그때마다 아이콘이 사라졌다 튀어나온다.
            exit={{
              opacity: 0,
              scale: 0.4,
              transition: {
                duration: ORBIT_ICON_EXIT_DURATION_SECOND,
                ease: 'easeIn',
              },
            }}
            aria-hidden="true"
          >
            {/* 궤도 회전 래퍼. 이 원이 돌면 12시 방향에 붙은 아이콘이 원을 그린다.
                크기가 min(rem, %)라 기존 링과 같은 방식으로 반응형이 따라온다. */}
            <div
              className={`h-full w-full ${orbitClassName}`}
              style={orbitDurationStyle}
            >
              {/* 궤도 원의 12시 지점에 아이콘 중심을 맞춰 붙인다. */}
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                {/* 궤도 회전을 상쇄해 아이콘이 늘 똑바로 서 있게 한다. */}
                <div
                  className={counterRotateClassName}
                  style={orbitDurationStyle}
                >
                  {/* 궤도와 별개로 위아래로 둥실거린다.
                      회전과 transform이 충돌하지 않도록 요소를 따로 둔다. */}
                  <div
                    className="animate-sound-bob"
                    style={{ '--bob-duration': bobDuration } as CSSProperties}
                  >
                    {/* 크기에 width/height와 font-size를 함께 주는 이유:
                        직접 그린 SVG는 viewBox뿐이라 width/height로 조절되고,
                        FontAwesome 폴백은 height:1em이 강제돼 font-size로만 조절된다.
                        소리명에 따라 어느 쪽이 렌더될지 달라져 셋을 함께 건다.
                        (SoundCard와 같은 대응) */}
                    <span
                      className={`flex items-center justify-center leading-none transition-colors duration-700 ${colorClassName}`}
                      style={{
                        width: iconSize,
                        height: iconSize,
                        fontSize: iconSize,
                        filter: glowFilter,
                      }}
                    >
                      <SoundIconView
                        soundName={sound.label}
                        categoryName={sound.category}
                        className="h-full w-full leading-none"
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
};

export default FloatingSoundIcons;
