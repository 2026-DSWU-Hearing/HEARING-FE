import { Link } from 'react-router-dom';
import { usePatchActivateMode } from '@/pages/home/hooks/usePatchActivateMode';
import type { ModeTypes } from '@/pages/home/types/modeTypes';

interface ModeCardPropTypes {
  mode: ModeTypes;
  isSelected: boolean;
  onModeSelect: (modeId: number) => void;
}

const ModeCard = ({ mode, isSelected, onModeSelect }: ModeCardPropTypes) => {
  const { mutate: activateMode } = usePatchActivateMode();

  const handleActivateModeClick = () => {
    onModeSelect(mode.mode_id);
    activateMode(mode.mode_id);
  };

  const handleMoveModeSettingClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    event.stopPropagation();
  };

  return (
    <div
      onClick={handleActivateModeClick}
      className={`flex min-h-24 flex-1 cursor-pointer flex-col justify-between rounded-2xl p-4 ${
        isSelected ? 'border-2 border-black bg-gray-300' : 'bg-gray-300'
      }`}
    >
      <div className="flex flex-row justify-between gap-4 text-xl font-bold">
        <span>{mode.icon}</span>

        <Link
          to={`/modes/${mode.mode_id}/settings`}
          onClick={handleMoveModeSettingClick}
        >
          <span>{'>'}</span>
        </Link>
      </div>

      <span className="flex justify-end text-xl font-bold">{mode.name}</span>
    </div>
  );
};

export default ModeCard;
