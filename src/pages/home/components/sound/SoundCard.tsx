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
      className={`@container flex h-full min-h-[7rem] min-w-0 flex-col rounded-xl p-sm text-center transition-all duration-500 ease-out ${
        isDoNotDisturb
          ? 'cursor-not-allowed'
          : 'cursor-pointer active:scale-[0.97]'
      } ${cardStyle} `}
    >
      {/* 아이콘 + 소리명: 남는 세로 공간(flex-1)을 채우며 가운데 정렬 →
          카드가 길어져도 카테고리를 밀어내 바닥에 고정시킨다 */}
      <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-xs transition-colors duration-300 ease-out">
        {/* 직접 그린 SVG는 h-/w-(박스 크기)로, FA 폴백은 text-(font-size)로 크기가 정해지므로
            두 경로가 같은 크기로 보이도록 동일한 clamp 를 h/w 와 text 에 모두 준다. */}
        <SoundIconView
          soundName={sound.name}
          categoryName={categoryName}
          className="h-[clamp(1.75rem,32cqi,2.25rem)] w-[clamp(1.75rem,32cqi,2.25rem)] text-[clamp(1.75rem,32cqi,2.25rem)] leading-none transition-transform duration-300 ease-out"
        />
        <span className="heading-base-semibold w-full break-keep text-center transition-colors duration-300 ease-out">
          {sound.name}
        </span>
      </div>

      {/* 카테고리: 카드 바닥에 고정 → 행마다 카드 높이가 달라도 라인이 가지런 */}
      <div className="mt-xs flex w-full min-w-0 justify-center">
        <CategoryBlock
          categoryName={categoryName}
          isDisabled={isDoNotDisturb}
        />
      </div>
    </button>
  );
};

export default SoundCard;
