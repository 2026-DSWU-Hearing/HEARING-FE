interface ModeIconButtonProps {
  iconId: string;
  isSelected: boolean;
  onSelectIcon: (iconId: string) => void;
}

const ModeIconButton = ({ iconId, isSelected, onSelectIcon }: ModeIconButtonProps) => {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      aria-label={`${iconId} 선택`}
      onClick={() => onSelectIcon(iconId)}
    >
      문
    </button>
  );
};

export default ModeIconButton;
