import CategoryBlock from '@/pages/home/components/sound/CategoryBlock';

interface SoundCardSoundTypes {
  sound_id: number;
  name: string;
  category?: string;
  category_name?: string;
}

interface SoundCardPropTypes {
  sound: SoundCardSoundTypes;
  isDisabled?: boolean;
  isDoNotDisturb?: boolean;
  isSelected?: boolean;
  isEditMode?: boolean;
  onClick?: (soundId: number) => void;
}

const getSoundIcon = (categoryName: string) => {
  if (categoryName.includes('긴급') || categoryName.includes('위험')) {
    return '!';
  }

  if (categoryName.includes('생활')) {
    return '●';
  }

  return '♪';
};

const SoundCard = ({
  sound,
  isDisabled = false,
  isDoNotDisturb = false,
  isSelected = false,
  isEditMode = false,
  onClick,
}: SoundCardPropTypes) => {
  const categoryName = sound.category ?? sound.category_name ?? '기타';

  const handleSoundCardClick = () => {
    onClick?.(sound.sound_id);
  };

  const cardStyle = isEditMode
    ? 'bg-gray-300'
    : isDisabled
      ? 'bg-gray-300 opacity-70'
      : 'bg-[#f8c3a4]';

  return (
    <button
      type="button"
      aria-disabled={isDoNotDisturb}
      onClick={handleSoundCardClick}
      className={`aspect-square rounded-3xl border-2 p-3 text-center ${
        isDoNotDisturb ? 'cursor-not-allowed' : 'cursor-pointer'
      } ${cardStyle} ${
        isSelected ? 'border-black' : 'border-transparent'
      }`}
    >
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <span className="text-4xl font-black leading-none">
          {getSoundIcon(categoryName)}
        </span>
        <span className="text-base font-bold">{sound.name}</span>
        <CategoryBlock categoryName={categoryName} />
      </div>
    </button>
  );
};

export default SoundCard;
