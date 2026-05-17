import CategoryBadge from './CategoryBadge';

import type { Sound } from '../../types/soundFiltering';

interface AddSoundCardProps {
  sound: Sound;
  isSelected: boolean;
  onToggle: (soundId: number) => void;
}

const AddSoundCard = ({ sound, isSelected, onToggle }: AddSoundCardProps) => {
  return (
    <button type="button" aria-pressed={isSelected} onClick={() => onToggle(sound.id)}>
      <span aria-hidden="true">{sound.iconLabel}</span>
      <strong>{sound.name}</strong>
      <CategoryBadge category={sound.category} />
      <span aria-hidden="true">{isSelected ? '-' : '+'}</span>
    </button>
  );
};

export default AddSoundCard;
