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
    onToggle(sound.sound_id);
  };

  return (
    <button
      type="button"
      onClick={handleSoundToggleClick}
      aria-pressed={isSelected}
      className={`p-2`}
    >
      <p>{sound.name}</p>
      <p>{sound.category_name}</p>
      <p>{isSelected ? '선택됨' : '선택 안 됨'}</p>
    </button>
  );
};

export default ModeSoundSelectBlock;
