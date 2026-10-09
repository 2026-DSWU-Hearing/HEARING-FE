import ModeIcon from '@/pages/home/components/modeForm/ModeIcon';
import { useGetModeIcons } from '@/pages/home/hooks/useGetModeIcons';

interface ModeIconPickerPropTypes {
  selectedIcon: string;
  onIconSelect: (iconKey: string) => void;
}

const IconPicker = ({
  selectedIcon,
  onIconSelect,
}: ModeIconPickerPropTypes) => {
  const { data, isLoading, isError } = useGetModeIcons();

  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-[320px] grid-cols-5 gap-sm">
        {Array.from({ length: 15 }).map((_, index) => (
          <div
            key={index}
            className="aspect-square animate-pulse rounded-pill bg-neutral-700"
          />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className="text-center text-sm font-bold text-neutral-400">
        아이콘 목록을 불러오지 못했습니다
      </p>
    );
  }

  return (
    <div className="mx-auto grid max-w-[320px] grid-cols-5 gap-sm">
      {data.icons.map((icon) => (
        <ModeIcon
          key={icon.icon_key}
          iconKey={icon.icon_key}
          nameKo={icon.name_ko}
          isSelected={selectedIcon === icon.icon_key}
          onClick={onIconSelect}
        />
      ))}
    </div>
  );
};

export default IconPicker;
