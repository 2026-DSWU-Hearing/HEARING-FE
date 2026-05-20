import { Link } from 'react-router-dom';

import type { Mode } from '../../types/soundFiltering';

interface ModeCardPropTypes {
  mode: Mode;
  onChangeMode: (modeId: number) => void;
}

const ModeCard = ({ mode, onChangeMode }: ModeCardPropTypes) => {
  {
    /* 모드 전환 함수*/
  }
  const handleChangeModeClick = () => {
    if (mode.isActivated) {
      return;
    }

    onChangeMode(mode.id);
  };

  return (
    <div
      className={`flex flex-col rounded-lg py-1  gap-4 cursor-pointer ${mode.isActivated ? 'bg-amber-500 ring-2 ring-amber-600' : 'bg-gray-300'}`}
      aria-pressed={mode.isActivated}
      onClick={handleChangeModeClick}
    >
      {/*모드 아이콘, 모드 설정 버튼 묶음*/}
      <div className="flex flex-row gap-15 justify-center">
        <span>{mode.iconLabel}</span>
        <Link
          to={`/modes/${mode.id}/settings`}
          className="shrink-0 z-1"
          aria-label={`${mode.name} 모드 설정`}
        >
          <span aria-hidden="true">{'>'}</span>
        </Link>
      </div>
      {/* 모드 이름 */}
      <span className="pr-5 self-end">{mode.name}</span>
    </div>
  );
};

export default ModeCard;
