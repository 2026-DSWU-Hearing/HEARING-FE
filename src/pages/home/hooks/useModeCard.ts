import type { MouseEvent } from 'react';
import { useHomeModeContext } from '@/pages/home/hooks/useHomeModeContext';
import { usePatchActivateMode } from '@/pages/home/hooks/usePatchActivateMode';

interface UseModeCardParamTypes {
  modeId: number;
}

export const useModeCard = ({ modeId }: UseModeCardParamTypes) => {
  const { handleModeSelect } = useHomeModeContext();
  const { mutate: activateMode } = usePatchActivateMode();

  const handleActivateModeClick = () => {
    // 화면 반응은 즉시 바꾸고, 서버의 활성 모드는 mutation으로 맞춘다.
    handleModeSelect(modeId);
    activateMode(modeId);
  };

  const handleMoveModeSettingClick = (
    event: MouseEvent<HTMLAnchorElement>,
  ) => {
    event.stopPropagation();
  };

  return {
    handleActivateModeClick,
    handleMoveModeSettingClick,
  };
};
