import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import CategoryBlock from '@/pages/home/components/sound/CategoryBlock';
import SoundIconView from '@/shared/components/icons/sounds/SoundIconView';
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
      className={`flex h-[2.5rem] w-full items-center gap-sm rounded-pill border py-xs px-sm text-left transition-colors active:scale-[0.99] ${
        isSelected
          ? 'border-primary-500/70 bg-primary-300/10'
          : 'border-1 border-neutral-700 bg-[#252623]'
      }`}
    >
      <span className="flex h-[1.5rem] w-[1.5rem] shrink-0 items-center justify-center text-primary">
        <SoundIconView
          soundName={sound.name}
          categoryName={sound.category_name}
          className="w-icon-base h-icon-base leading-none"
        />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate body-sm-regular text-secondary">
          {sound.name}
        </span>
      </span>

      <span className="shrink-0">
        <CategoryBlock categoryName={sound.category_name} />
      </span>

      <span
        className={`flex w-[1.5rem] h-[1.5rem] shrink-0 items-center justify-center rounded-pill text-base ${
          isSelected
            ? 'bg-primary-500 text-inverse'
            : 'bg-neutral-600 text-primary'
        }`}
      >
        <FontAwesomeIcon icon={isSelected ? faMinus : faPlus} />
      </span>
    </button>
  );
};

export default ModeSoundSelectBlock;
