import { Link } from 'react-router-dom';
import { usePatchActivateMode } from '@/pages/home/hooks/usePatchActivateMode';
import type { ModeTypes } from '@/pages/home/types/modeTypes';

interface ModeCardPropTypes {
  mode: ModeTypes;
}

const ModeCard = ({ mode }: ModeCardPropTypes) => {
  const { mutate: activateMode } = usePatchActivateMode();

  const handleActivateModeClick = () => {
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
      className={`flex cursor-pointer flex-col gap-4 rounded-lg p-4 ${
        mode.is_active ? 'bg-amber-500 ring-2 ring-amber-600' : 'bg-gray-300'
      }`}
    >
      <div className="flex flex-row justify-center gap-10">
        <span>{mode.icon}</span>

        <Link
          to={`/modes/${mode.mode_id}`}
          onClick={handleMoveModeSettingClick}
        >
          <span>{'>'}</span>
        </Link>
      </div>

      <span className="flex justify-end">{mode.name}</span>
    </div>
  );
};

export default ModeCard;
