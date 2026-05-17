import CategoryBadge from './CategoryBadge';

import type { Sound } from '../../types/soundFiltering';

interface AddSoundCardProps {
  sound: Sound;
}

const AddSoundCard = ({ sound }: AddSoundCardProps) => {
  return (
    <button type="button">
      <span aria-hidden="true">{sound.iconLabel}</span>
      <strong>{sound.name}</strong>
      <CategoryBadge category={sound.category} />
    </button>
  );
};

export default AddSoundCard;
