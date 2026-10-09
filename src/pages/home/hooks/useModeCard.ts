import type { KeyboardEvent, MouseEvent } from 'react';
import { useHomeModeContext } from '@/pages/home/hooks/useHomeModeContext';

interface UseModeCardParamTypes {
  modeId: number;
  isDoNotDisturb: boolean;
}

// 모드 카드 한 장의 동작(카드 선택+활성화, 설정 이동 시 클릭 전파 차단)을 담당하는 훅
export const useModeCard = ({
  modeId,
  isDoNotDisturb,
}: UseModeCardParamTypes) => {
  const { handleModeActivate } = useHomeModeContext();

  // 카드 전체를 눌렀을 때, 해당 모드를 활성화하는 함수.
  // 선택 전환·서버 요청·실패 롤백은 컨텍스트(handleModeActivate)가 한곳에서 처리한다.
  const handleActivateModeClick = () => {
    if (isDoNotDisturb) return;

    handleModeActivate(modeId);
  };
  // 키보드(Enter/Space)로도 카드를 활성화할 수 있게 하는 함수
  const handleActivateModeKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    // 설정 링크 같은 자식 요소에서 올라온 키 입력은 무시한다(링크의 Enter가 모드 활성화까지 일으키지 않게).
    if (event.target !== event.currentTarget) return;
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
