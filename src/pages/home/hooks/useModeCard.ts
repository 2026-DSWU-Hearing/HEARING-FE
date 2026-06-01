import type { MouseEvent } from 'react';
import { useHomeModeContext } from '@/pages/home/hooks/useHomeModeContext';
import { usePatchActivateMode } from '@/pages/home/hooks/usePatchActivateMode';

interface UseModeCardParamTypes {
  modeId: number;
}

// 모드 카드 한 장의 동작(카드 선택+활성화, 설정 이동 시 클릭 전파 차단)을 담당하는 훅
export const useModeCard = ({ modeId }: UseModeCardParamTypes) => {
  const { handleModeSelect } = useHomeModeContext();
  const { mutate: activateMode } = usePatchActivateMode();

  // 카드 전체를 눌렀을 때, 해당 모드를 활성화하는 함수
  const handleActivateModeClick = () => {
    // 화면 반응은 즉시 바꾸고, 서버의 활성 모드는 mutation으로 맞춘다.
    handleModeSelect(modeId);
    activateMode(modeId);
  };
  // 버튼을 눌렀을 때, 카드 클릭 이벤트가 같이 실행되지 않게 막는 함수
  const handleMoveModeSettingClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();
  };

  return {
    handleActivateModeClick,
    handleMoveModeSettingClick,
  };
};
