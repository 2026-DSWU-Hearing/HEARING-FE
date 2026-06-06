import { Link } from 'react-router-dom';
import { useModeCard } from '@/pages/home/hooks/useModeCard';
import type { ModeTypes } from '@/pages/home/types/modeTypes';

interface ModeCardPropTypes {
  mode: ModeTypes;
  isSelected: boolean;
}

const ModeCard = ({ mode, isSelected }: ModeCardPropTypes) => {
  const { handleActivateModeClick, handleMoveModeSettingClick } = useModeCard({
    modeId: mode.id,
  });

  return (
    // 화살표 제외 영역은 누르면 활성 비활성
    <div
      onClick={handleActivateModeClick}
      className={`flex min-h-24 flex-1 cursor-pointer flex-col justify-between rounded-2xl p-4 ${
        isSelected ? 'border-2 border-black bg-gray-300' : 'bg-gray-300'
      }`}
    >
      <div className="flex flex-row justify-between gap-4 text-xl font-bold">
        <span>{mode.icon}</span>

        {/*모드 설정으로 이동 버튼*/}
        <Link
          to={`/modes/${mode.id}/settings`}
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
