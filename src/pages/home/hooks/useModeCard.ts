import type { KeyboardEvent, MouseEvent } from 'react';
import { useHomeModeContext } from '@/pages/home/hooks/useHomeModeContext';
import { usePatchActivateMode } from '@/pages/home/hooks/usePatchActivateMode';

interface UseModeCardParamTypes {
  modeId: number;
  isDoNotDisturb: boolean;
}

// 모드 카드 한 장의 동작(카드 선택+활성화, 설정 이동 시 클릭 전파 차단)을 담당하는 훅
export const useModeCard = ({
  modeId,
  isDoNotDisturb,
}: UseModeCardParamTypes) => {
  const { handleModeSelect } = useHomeModeContext();
  const { mutate: activateMode } = usePatchActivateMode();

  // 카드 전체를 눌렀을 때, 해당 모드를 활성화하는 함수
  const handleActivateModeClick = () => {
    if (isDoNotDisturb) return;

    // 화면 반응은 즉시 바꾸고, 서버의 활성 모드는 mutation으로 맞춘다.
    handleModeSelect(modeId);
    activateMode(modeId);
  };
  // 키보드(Enter/Space)로도 카드를 활성화할 수 있게 하는 함수
  const handleActivateModeKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (isDoNotDisturb) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    handleActivateModeClick();
  };

  // 버튼을 눌렀을 때, 카드 클릭 이벤트가 같이 실행되지 않게 막는 함수
  // 방해금지 모드에서는 설정 페이지로의 이동(기본 동작)도 함께 막는다.
  const handleMoveModeSettingClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();

    if (isDoNotDisturb) {
      event.preventDefault();
    }
  };

  return {
    handleActivateModeClick,
    handleActivateModeKeyDown,
    handleMoveModeSettingClick,
  };
};
