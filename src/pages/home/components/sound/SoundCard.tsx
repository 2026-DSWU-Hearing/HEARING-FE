import CategoryBlock from '@/pages/home/components/sound/CategoryBlock';
import SoundIconView from '@/shared/components/icons/sounds/SoundIconView';

interface SoundCardSoundTypes {
  sound_id: number;
  name: string;
  category?: string;
  category_name?: string;
}

interface SoundCardPropTypes {
  sound: SoundCardSoundTypes;
  isActive?: boolean;
  isDoNotDisturb?: boolean;
  isEditMode?: boolean;
  isSelected?: boolean;
  onClick?: (soundId: number) => void;
}

const SoundCard = ({
  sound,
  isActive = true,
  isDoNotDisturb = false,
  isEditMode = false,
  isSelected = false,
  onClick,
}: SoundCardPropTypes) => {
  const categoryName = sound.category ?? sound.category_name ?? '기타';

  const handleSoundCardClick = () => {
    onClick?.(sound.sound_id);
  };

  const isOnStyle = isEditMode ? isSelected : isActive;

  const cardStyle = isDoNotDisturb
    ? 'bg-neutral-900 text-neutral-700'
    : isOnStyle
      ? 'card-true-bottomsheet tag-glass-effect text-primary'
      : 'bg-neutral-800 text-primary border-[1px] solid border-neutral-600';

  return (
    <button
      type="button"
      aria-disabled={isDoNotDisturb}
      onClick={handleSoundCardClick}
      className={`aspect-square rounded-xl p-sm text-center transition-all duration-500 ease-out ${
        isDoNotDisturb
          ? 'cursor-not-allowed'
          : 'cursor-pointer active:scale-[0.97]'
      } ${cardStyle} `}
    >
      <div className="flex h-full flex-col items-center justify-center gap-xs transition-colors duration-300 ease-out">
        <SoundIconView
          soundName={sound.name}
          categoryName={categoryName}
          className="w-icon-2xl h-icon-2xl leading-none transition-transform duration-300 ease-out"
        />
        <span className="heading-base-semibold transition-colors duration-300 ease-out">
          {sound.name}
        </span>
        <CategoryBlock categoryName={categoryName} isDisabled={isDoNotDisturb} />
      </div>
    </button>
  );
};

export default SoundCard;
