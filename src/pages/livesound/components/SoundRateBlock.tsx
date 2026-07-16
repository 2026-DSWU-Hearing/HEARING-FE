import type { SoundRateTypes } from '../types/soundRateTypes';

// 감지 중인데 아직 잡힌 소리가 없을 때 카드에 표시할 안내 문구.
const EMPTY_DETECTION_MESSAGE = '주변에서 아무 소리도 감지되지 않았어요';

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

  // 감지 중이지만 아직 잡힌 소리가 없으면, 빈 화면 대신 안내 문구를 보여준다.
  if (soundRateList.length === 0) {
    return (
      <div className={CARD_CLASS_NAME}>
        <p className="body-base-medium text-center text-secondary">
          {EMPTY_DETECTION_MESSAGE}
        </p>
      </div>
    );
  }

  return (
    <ul className={CARD_CLASS_NAME}>
      {soundRateList.map(({ id, label, rate }) => (
        <li key={id} className="flex items-center justify-between gap-base">
          <span className="heading-base-semibold min-w-0 truncate text-primary-500">
            {label}
          </span>
          <span className="heading-base-semibold shrink-0 text-secondary">
            {rate}%
          </span>
        </li>
      ))}
    </ul>
  );
};

export default SoundRateBlock;
