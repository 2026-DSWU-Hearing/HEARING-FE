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
      className={`flex aspect-square items-center justify-center rounded-xl text-xl font-bold ${
        isSelected ? 'bg-[#f8c3a4]' : 'bg-gray-300'
      }`}
      aria-pressed={isSelected}
    >
      {icon}
    </button>
  );
};

export default ModeIcon;
