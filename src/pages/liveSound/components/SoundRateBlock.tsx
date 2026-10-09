import SoundIconView from '@/shared/components/icons/sounds/SoundIconView';

import type { SoundRateTypes } from '../types/soundRateTypes';

// 감지 중인데 아직 잡힌 소리가 없을 때 카드에 표시할 안내 문구.
const EMPTY_DETECTION_MESSAGE = '주변에서 아무 소리도 감지되지 않았어요';

interface SoundRateBlockPropTypes {
  isListening: boolean;
  soundRateList: SoundRateTypes[];
}

// 좌우 패딩을 px-base로 둔 이유: 한 줄에 아이콘·막대·퍼센트가 고정 폭으로 들어가
// 320px 화면에서는 소리 이름에 남는 폭이 빠듯하다. 패딩과 항목 gap을 줄여 이름 칸을 확보한다.
const CARD_CLASS_NAME =
  'tag-glass-effect mt-[2rem] bg-[#21221E]/50 flex w-full flex-col gap-base rounded-2xl px-base py-base';

const SoundRateBlock = ({
  isListening,
  soundRateList,
}: SoundRateBlockPropTypes) => {
  // 감지 중이 아니면(idle) 카드 자체를 숨긴다.
  if (!isListening) {
    return null;
  }

  // 감지 중이지만 아직 잡힌 소리가 없으면, 빈 화면 대신 안내 문구를 보여준다.
  // 서버가 준 결과는 거르지 않고 그대로 보여준다. confidence가 낮다고 프론트가
  // 빼면 실제로 난 소리를 놓치게 되고, 그건 이 서비스에서 가장 위험한 실패다.
  if (soundRateList.length === 0) {
    return (
      <div className={CARD_CLASS_NAME}>
        <p className="body-base-medium text-center text-secondary">
          {EMPTY_DETECTION_MESSAGE}
        </p>
      </div>
    );
  }

  // 막대 길이를 비교하려면 순서가 고정돼야 한다. 서버 응답 순서에 기대지 않는다.
  const sortedSoundList = [...soundRateList].sort(
    (first, second) => second.rate - first.rate,
  );

  return (
    <ul className={CARD_CLASS_NAME}>
      {sortedSoundList.map(({ id, label, category, rate }, index) => {
        // 1순위만 강조한다. 중앙에 크게 뜬 아이콘과 같은 소리라는 신호이기도 하다.
        const isPrimary = index === 0;

        return (
          <li key={id} className="flex items-center gap-sm">
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

            {/* 소리 이름은 잘라내지 않는다. 무슨 소리인지가 이 화면의 핵심 정보라
                말줄임(…)으로 가리면 안 된다. 칸보다 길면 단어(띄어쓰기) 단위로 줄바꿈한다.
                320px 화면 기준 이름 칸은 약 98px로, 가장 긴 이름(7글자)도 한 줄에 들어간다. */}
            <span
              className={`heading-base-semibold min-w-0 flex-1 break-keep ${
                isPrimary ? 'text-primary-300' : 'text-secondary'
              }`}
            >
              {label}
            </span>

            {/* 서열 막대. 숫자가 바로 옆에 텍스트로 있으므로 보조기기에는 노출하지 않는다
                (같은 값을 두 번 읽게 된다).
                폭은 행(li) 너비의 22%다. 모든 행의 너비가 같으므로 비율로 줘도 막대 길이가
                행마다 똑같아 이름 길이와 무관하게 정렬된다. 화면이 넓어지면 막대도 같이
                길어지고(430px에서 약 80px), 320px에서는 하한 3.5rem(56px)이 걸려 이름 칸을
                지킨다. flex-1(이름)이 아니라 막대에 비율을 주는 이유: 이름을 늘리면 막대가
                행마다 달라지지만, 막대를 비율로 두면 남는 공간이 전부 이름으로 간다. */}
            <span
              aria-hidden="true"
              className="h-[0.375rem] w-[22%] min-w-[3.5rem] shrink-0 overflow-hidden rounded-pill bg-neutral-700"
            >
              <span
                className={`block h-full rounded-pill transition-[width] duration-500 ${
                  isPrimary ? 'bg-primary-300' : 'bg-neutral-600'
                }`}
                style={{ width: `${rate}%` }}
              />
            </span>

            <span
              className={`heading-base-semibold w-[2.5rem] shrink-0 text-right ${
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
