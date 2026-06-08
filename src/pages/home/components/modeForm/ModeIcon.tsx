import ModeIconView from '@/shared/components/icons/modes/ModeIconView';

interface ModeIconPropTypes {
  iconKey: string;
  nameKo: string;
  isSelected: boolean;
  onClick: (iconKey: string) => void;
}

const ModeIcon = ({ iconKey, nameKo, isSelected, onClick }: ModeIconPropTypes) => {
  const handleModeIconClick = () => {
    onClick(iconKey);
  };

  return (
    <button
      type="button"
      onClick={handleModeIconClick}
      className={`flex aspect-square items-center justify-center rounded-pill body-base-medium ${
        isSelected ? 'bg-[#FFE26E]/60 text-primary' : 'bg-neutral-700 text-tertiary'
      }`}
      aria-pressed={isSelected}
      aria-label={nameKo}
    >
      <ModeIconView iconKey={iconKey} className="w-6 h-6" />
    </button>
  );
};

export default ModeIcon;
