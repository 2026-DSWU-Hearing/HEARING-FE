import { Link } from 'react-router-dom';
import { useModeCard } from '@/pages/home/hooks/useModeCard';
import type { ModeTypes } from '@/pages/home/types/modeTypes';

interface ModeCardPropTypes {
  mode: ModeTypes;
  isSelected: boolean;
}

const ModeCard = ({ mode, isSelected }: ModeCardPropTypes) => {
  const { handleActivateModeClick, handleMoveModeSettingClick } = useModeCard({
    modeId: mode.mode_id,
  });

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
