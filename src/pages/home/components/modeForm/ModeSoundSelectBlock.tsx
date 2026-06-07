import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMinus,
  faPlus,
  faVolumeHigh,
} from '@fortawesome/free-solid-svg-icons';
import CategoryBlock from '@/pages/home/components/sound/CategoryBlock';
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
      className={`flex h-[4rem] w-full items-center gap-sm rounded-lg border px-base text-left transition-colors active:scale-[0.99] ${
        isSelected
          ? 'border-primary-300/70 bg-primary-300/10'
          : 'border-neutral-700 bg-neutral-950/20'
      }`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-neutral-800 text-secondary">
        <FontAwesomeIcon icon={faVolumeHigh} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate heading-lg-semibold text-primary">
          {sound.name}
        </span>
      </span>

      <span className="shrink-0">
        <CategoryBlock categoryName={sound.category_name} />
      </span>

      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-pill text-base ${
          isSelected
            ? 'bg-primary-300 text-inverse'
            : 'bg-neutral-600 text-primary'
        }`}
      >
        <FontAwesomeIcon icon={isSelected ? faMinus : faPlus} />
      </span>
    </button>
  );
};

export default ModeSoundSelectBlock;
