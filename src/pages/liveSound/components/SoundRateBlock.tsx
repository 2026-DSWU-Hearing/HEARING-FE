import SoundIconView from '@/shared/components/icons/sounds/SoundIconView';

import { SOUND_RATE_DISPLAY_THRESHOLD } from '../constants/liveSoundDisplayConfig';
import type { SoundRateTypes } from '../types/soundRateTypes';

// 감지 중인데 아직 잡힌 소리가 없을 때 카드에 표시할 안내 문구.
const EMPTY_DETECTION_MESSAGE = '주변에서 아무 소리도 감지되지 않았어요';

// rate는 0~100인데 임계값 상수는 0~1(confidence) 기준이라 맞춰준다.
const DISPLAY_THRESHOLD_RATE = SOUND_RATE_DISPLAY_THRESHOLD * 100;

interface SoundRateBlockPropTypes {
  isListening: boolean;
  soundRateList: SoundRateTypes[];
}

const CARD_CLASS_NAME =
  'tag-glass-effect mt-[2rem] bg-[#21221E]/50 flex w-full flex-col gap-base rounded-2xl px-xl py-base';

const SoundRateBlock = ({
  isListening,
  soundRateList,
}: SoundRateBlockPropTypes) => {
  // 감지 중이 아니면(idle) 카드 자체를 숨긴다.
  if (!isListening) {
    return null;
  }

  // 확신이 낮은 소리는 아예 빼서 목록을 신뢰할 수 있게 만든다.
  // 항목이 3개가 안 되더라도 억지로 채우지 않는다.
  const visibleSoundList = soundRateList.filter(
    ({ rate }) => rate >= DISPLAY_THRESHOLD_RATE,
  );

  // 감지 중이지만 보여줄 소리가 없으면, 빈 화면 대신 안내 문구를 보여준다.
  if (visibleSoundList.length === 0) {
    return (
      <div className={CARD_CLASS_NAME}>
        <p className="body-base-medium text-center text-secondary">
          {EMPTY_DETECTION_MESSAGE}
        </p>
      </div>
    );
  }

  // 막대 길이를 비교하려면 순서가 고정돼야 한다. 서버 응답 순서에 기대지 않는다.
  const sortedSoundList = [...visibleSoundList].sort(
    (first, second) => second.rate - first.rate,
  );

  return (
    <ul className={CARD_CLASS_NAME}>
      {sortedSoundList.map(({ id, label, category, rate }, index) => {
        // 1순위만 강조한다. 중앙에 크게 뜬 아이콘과 같은 소리라는 신호이기도 하다.
        const isPrimary = index === 0;

        return (
          <li key={id} className="flex items-center gap-base">
            <span
              className={`flex h-icon-md w-icon-md shrink-0 items-center justify-center text-[1.25rem] leading-none ${
                isPrimary ? 'text-primary-300' : 'text-tertiary'
              }`}
            >
              <SoundIconView
                soundName={label}
                categoryName={category}
                className="h-full w-full leading-none"
              />
            </span>

            <span
              className={`heading-base-semibold min-w-0 flex-1 truncate ${
                isPrimary ? 'text-primary-300' : 'text-secondary'
              }`}
            >
              {label}
            </span>

            {/* 서열 막대. 숫자가 바로 옆에 텍스트로 있으므로 보조기기에는 노출하지 않는다
                (같은 값을 두 번 읽게 된다). 폭을 고정해 이름 길이와 무관하게 정렬된다. */}
            <span
              aria-hidden="true"
              className="h-[0.375rem] w-[4.5rem] shrink-0 overflow-hidden rounded-pill bg-neutral-700"
            >
              <span
                className={`block h-full rounded-pill transition-[width] duration-500 ${
                  isPrimary ? 'bg-primary-300' : 'bg-neutral-600'
                }`}
                style={{ width: `${rate}%` }}
              />
            </span>

            <span
              className={`heading-base-semibold w-[3rem] shrink-0 text-right ${
                isPrimary ? 'text-primary-300' : 'text-secondary'
              }`}
            >
              {rate}%
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default SoundRateBlock;
