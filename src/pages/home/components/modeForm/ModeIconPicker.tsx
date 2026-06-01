import ModeIcon from '@/pages/home/components/modeForm/ModeIcon';

const MODE_ICON_OPTIONS = [
  '집',
  '바깥',
  '업무',
  '여행',
  '주의',
  '별',
  '가방',
  '문',
  '달',
  '차',
  '병원',
  '학교',
  '카페',
  '버스',
  '알림',
  '불',
  '물',
  '음악',
];

interface ModeIconPickerPropTypes {
  selectedIcon: string;
  onIconSelect: (icon: string) => void;
}

const IconPicker = ({
  selectedIcon,
  onIconSelect,
}: ModeIconPickerPropTypes) => {
  return (
    <div className="mx-auto grid max-w-[320px] grid-cols-6 gap-3">
      {MODE_ICON_OPTIONS.map((icon) => (
        <ModeIcon
          key={icon}
          icon={icon}
          isSelected={selectedIcon === icon}
          onClick={onIconSelect}
        />
      ))}
    </div>
  );
};

export default IconPicker;
