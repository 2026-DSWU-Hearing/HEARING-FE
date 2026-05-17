import CategoryBadge from '../sound/CategoryBadge';

import type { Sound } from '../../types/soundFiltering';

interface SelectableSoundRowProps {
  sound: Sound;
  isSelected: boolean;
  onToggleSound: (soundId: string) => void;
}

const SelectableSoundRow = ({
  sound,
  isSelected,
  onToggleSound,
}: SelectableSoundRowProps) => {
  return (
    <button type="button" aria-pressed={isSelected} onClick={() => onToggleSound(sound.id)}>
      <span aria-hidden="true">{sound.iconLabel}</span>
      <strong>{sound.name}</strong>
      <CategoryBadge category={sound.category} />
      <span aria-hidden="true">{isSelected ? '-' : '+'}</span>
    </button>
  );
};

export default SelectableSoundRow;
