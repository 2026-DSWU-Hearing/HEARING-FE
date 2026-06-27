import type { SoundRateTypes } from '../types/soundRateTypes';

interface SoundRateBlockPropTypes {
  soundRateList: SoundRateTypes[];
}

const SoundRateBlock = ({ soundRateList }: SoundRateBlockPropTypes) => {
  // 감지 중이 아니면 훅이 빈 배열을 주므로, 데이터가 없을 때 카드를 통째로 숨긴다.
  if (soundRateList.length === 0) {
    return null;
  }

  return (
    <ul className="tag-glass-effect mt-[2rem] bg-[#21221E]/50 flex w-full flex-col gap-base rounded-2xl px-xl py-base">
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
