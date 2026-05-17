import ModeIconButton from './ModeIconButton';

interface ModeIconPickerProps {
  selectedIconId: string;
  onSelectIcon: (iconId: string) => void;
}

const iconIds = Array.from({ length: 18 }, (_, index) => `icon-${index + 1}`);

const ModeIconPicker = ({ selectedIconId, onSelectIcon }: ModeIconPickerProps) => {
  return (
    <section aria-labelledby="mode-icon-title">
      <h2 id="mode-icon-title">아이콘 선택</h2>
      <p>선택한 아이콘이 모드 탭에 표시됩니다</p>
      <div>
        {iconIds.map((iconId) => (
          <ModeIconButton
            key={iconId}
            iconId={iconId}
            isSelected={iconId === selectedIconId}
            onSelectIcon={onSelectIcon}
          />
        ))}
      </div>
    </section>
  );
};

export default ModeIconPicker;
