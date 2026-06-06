interface ModeIconPropTypes {
  icon: string;
  isSelected: boolean;
  onClick: (icon: string) => void;
}

const ModeIcon = ({ icon, isSelected, onClick }: ModeIconPropTypes) => {
  const handleModeIconClick = () => {
    onClick(icon);
  };

  return (
    <button
      type="button"
      onClick={handleModeIconClick}
      className={`flex aspect-square items-center justify-center rounded-pill body-base-medium ${
        isSelected ? 'bg-[#FFE26E]/60' : 'bg-neutral-700'
      }`}
      aria-pressed={isSelected}
    >
      {icon}
    </button>
  );
};

export default ModeIcon;
