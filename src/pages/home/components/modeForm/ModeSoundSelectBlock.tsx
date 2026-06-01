import type { SoundTypes } from '@/pages/home/types/soundTypes';

interface ModeSoundSelectBlockPropTypes {
  sound: SoundTypes;
  isSelected: boolean;
  onToggle: (soundId: number) => void;
}

const ModeSoundSelectBlock = ({
  sound,
  isSelected,
  onToggle,
}: ModeSoundSelectBlockPropTypes) => {
  const handleSoundToggleClick = () => {
    onToggle(sound.id);
  };

  return (
    <button
      type="button"
      onClick={handleSoundToggleClick}
      aria-pressed={isSelected}
    >
      <span>{sound.name}</span>
      <span>{sound.category.name}</span>
      <span>{isSelected ? '선택됨' : '선택 안 됨'}</span>
    </button>
  );
};

export default ModeSoundSelectBlock;
