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

  // 보더 두께는 1px 고정(시프트 방지), 색만 전환: 꺼짐=회색 / 켜짐=투명.
  const cardStyle = isDoNotDisturb
    ? 'bg-neutral-900 text-neutral-700 border border-neutral-900'
    : isOnStyle
      ? 'bg-neutral-800 text-primary border border-transparent'
      : 'bg-neutral-800 text-primary border border-neutral-600';

  const activeLayerStyle =
    !isDoNotDisturb && isOnStyle ? 'opacity-100' : 'opacity-0';

  return (
    <button
      type="button"
      aria-disabled={isDoNotDisturb}
      onClick={handleSoundCardClick}
      className={`@container relative flex h-full min-h-[7rem] min-w-0 flex-col overflow-hidden rounded-xl p-sm text-center transition-[color,border-color,transform] duration-700 ease-out ${
        isDoNotDisturb
          ? 'cursor-not-allowed'
          : 'cursor-pointer active:scale-[0.97]'
      } ${cardStyle} `}
    >
      {/* 켜짐 외형(글래스+그라데이션) 레이어. opacity 만 크로스페이드해 전환을 부드럽게 한다. */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 rounded-xl card-true-bottomsheet tag-glass-effect border-0 transition-opacity duration-700 ease-out ${activeLayerStyle}`}
      />
      {/* 아이콘 + 소리명: flex-1 로 남는 공간을 채워 카테고리를 바닥에 고정한다. */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col items-center justify-center gap-xs transition-colors duration-700 ease-out">
        {/* SVG(h/w)·FA 폴백(text) 두 경로가 같은 크기로 보이도록 동일 clamp 적용. */}
        <SoundIconView
          soundName={sound.name}
          categoryName={categoryName}
          className="h-[clamp(1.75rem,32cqi,2.25rem)] w-[clamp(1.75rem,32cqi,2.25rem)] text-[clamp(1.75rem,32cqi,2.25rem)] leading-none transition-transform duration-700 ease-out"
        />
        <span className="heading-base-semibold w-full break-keep text-center transition-colors duration-700 ease-out">
          {sound.name}
        </span>
      </div>

      {/* 카테고리: 카드 바닥에 고정해 행마다 높이가 달라도 라인을 가지런히. */}
      <div className="relative z-10 mt-xs flex w-full min-w-0 justify-center">
        <CategoryBlock
          categoryName={categoryName}
          isDisabled={isDoNotDisturb}
        />
      </div>
    </button>
  );
};

export default SoundCard;
