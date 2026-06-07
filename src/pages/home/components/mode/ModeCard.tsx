import { Link } from 'react-router-dom';
import { useModeCard } from '@/pages/home/hooks/useModeCard';
import type { ModeTypes } from '@/pages/home/types/modeTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

interface ModeCardPropTypes {
  mode: ModeTypes;
  isSelected: boolean;
  isDoNotDisturb: boolean;
}

const ModeCard = ({
  mode,
  isSelected,
  isDoNotDisturb,
}: ModeCardPropTypes) => {
  const { handleActivateModeClick, handleMoveModeSettingClick } = useModeCard({
    modeId: mode.mode_id,
    isDoNotDisturb,
  });

  const modeCardStyle = isDoNotDisturb
    ? 'cursor-not-allowed text-disabled opacity-60'
    : isSelected
      ? 'cursor-pointer text-primary'
      : 'cursor-pointer text-tertiary';

  const modeIconStyle = isDoNotDisturb
    ? 'bg-neutral-700 text-disabled'
    : isSelected
      ? 'text-white bg-primary-500/20 text-primary-500'
      : 'bg-neutral-700 text-tertiary';

  return (
    // 화살표 제외 영역은 누르면 활성 비활성
    <div
      onClick={handleActivateModeClick}
      aria-disabled={isDoNotDisturb}
      className={`relative flex h-full w-full flex-col justify-between overflow-hidden rounded-xl p-sm tag-glass-effect card-false transition-colors duration-300 ease-in-out ${modeCardStyle}`}
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 card-true transition-opacity duration-300 ease-in-out ${
          isSelected && !isDoNotDisturb ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <span
        className={`relative z-10 flex items-center justify-center w-[3rem] h-[3rem]  rounded-full p-2 transition-colors duration-300 ease-in-out ${modeIconStyle}`}
      >
        {mode.icon}
      </span>
      <div className="relative z-10 flex flex-row justify-between items-center mt-base">
        <div className="flex justify-end body-lg-medium font-bold">
          {mode.name}
        </div>

        {/*모드 설정으로 이동 버튼*/}
        <Link
          to={`/modes/${mode.mode_id}/settings`}
          onClick={handleMoveModeSettingClick}
        >
          <FontAwesomeIcon
            icon={faAngleRight}
            className="w-[1.5rem] h-[1.5rem]"
          />
        </Link>
      </div>
    </div>
  );
};

export default ModeCard;
