import CategoryBadge from './CategoryBadge';

import type { Sound } from '../../types/soundFiltering';

interface SoundCardProps {
  sound: Sound;
}
// 소리 카드 컴포넌트
const SoundCard = ({ sound }: SoundCardProps) => {
  return (
    <div className="flex flex-col items-center p-4  rounded-2xl bg-gray-400">
      <div>{sound.iconLabel}</div>
      <div>{sound.name}</div>
      <CategoryBadge category={sound.category} />
    </div>
  );
};

export default SoundCard;
