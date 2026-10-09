import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { HOME_ERROR_MESSAGE } from '@/pages/home/constants/modeMessages';
import { useGetModes } from '@/pages/home/hooks/useGetModes';
import { usePatchActivateMode } from '@/pages/home/hooks/usePatchActivateMode';
import { useGetUsers } from '@/shared/hooks/useGetUsers';
import { usePatchDoNotDisturb } from '@/shared/hooks/usePatchDoNotDisturb';

interface HomeModeProviderPropTypes {
  children: ReactNode;
}

interface HomeModeContextTypes {
  selectedModeId: number | null;
  isModesLoading: boolean;
  isDoNotDisturb: boolean;
  isDoNotDisturbPending: boolean;
  isActivatingMode: boolean;
  alertMessage: string;
  handleModeActivate: (modeId: number) => void;
  handleDoNotDisturbToggle: () => void;
  clearAlertMessage: () => void;
}

const HomeModeContext = createContext<HomeModeContextTypes | null>(null);

// 현재 선택된 모드 ID를 모드 목록과 소리 섹션이 함께 공유하도록 보관하는 Provider.
// 기본 선택(서버 활성 모드)은 effect가 아닌 렌더 중 파생값으로 정한다.
// effect로 맞추면 목록 응답 뒤 렌더를 한 번 더 거쳐야 소리 상세 조회가 시작되어 그만큼 늦어진다.
export const HomeModeProvider = ({ children }: HomeModeProviderPropTypes) => {
  // 사용자가 카드를 눌러 직접 고른 모드. null이면 아직 고른 적이 없어 서버 활성 모드를 따른다.
  const [userSelectedModeId, setUserSelectedModeId] = useState<number | null>(
    null,
  );
  // 홈 화면 공용 안내(요청 실패 등). 비어 있으면 모달을 띄우지 않는다.
  const [alertMessage, setAlertMessage] = useState('');
  const { data: modesData, isLoading: isModesLoading } = useGetModes();
  const { data: user, isLoading: isUserLoading } = useGetUsers();
  const { mutate: updateDoNotDisturb, isPending: isPatchPending } =
    usePatchDoNotDisturb();
  // 활성화 mutation은 Provider에 하나만 둔다. 카드마다 따로 만들면 진행 중 여부를 공유할 수 없다.
  const { mutate: activateMode, isPending: isActivatingMode } =
    usePatchActivateMode();

  // 직접 고른 모드가 목록에 남아 있으면 유지하고,
  // 없으면(첫 진입 또는 선택했던 모드가 삭제됨) 서버 활성 모드 → 첫 모드 순으로 기본 선택한다.
  const modes = modesData?.modes ?? [];
  const isUserSelectionInList = modes.some(
    (mode) => mode.mode_id === userSelectedModeId,
  );
  const selectedModeId = isUserSelectionInList
    ? userSelectedModeId
    : ((modes.find((mode) => mode.is_active) ?? modes[0])?.mode_id ?? null);

  // 방해금지 값은 서버(['users','me'] 캐시)가 단일 소스다.
  // 로컬 state로 들고 있으면 다른 탭으로 이동할 때 Provider가 언마운트되며 초기화된다.
  const isDoNotDisturb = user?.do_not_disturb ?? false;
  // 서버 값을 아직 못 받았을 때 토글하면 캐시가 비어 낙관적 업데이트가 건너뛰어지므로,
  // 첫 조회가 끝날 때까지도 버튼을 잠근다.
  const isDoNotDisturbPending = isPatchPending || isUserLoading;

  // 카드 클릭: 화면 선택을 즉시 바꾸고 서버 활성 모드를 맞춘다. 실패하면 선택을 되돌리고 안내한다.
  // 요청이 진행 중이면 연속 클릭을 무시한다. 응답 순서가 뒤바뀌어 화면과 서버가 어긋나는 것을 막는다.
  const handleModeActivate = useCallback(
    (modeId: number) => {
      if (isActivatingMode) return;

      // 롤백값은 파생값이 아닌 state를 저장한다. 실패 시 mutation이 목록 캐시의 is_active도 되돌리므로,
      // state가 null로 돌아가도 파생값이 이전 활성 모드를 다시 가리킨다.
      const previousModeId = userSelectedModeId;
      setUserSelectedModeId(modeId);
      activateMode(modeId, {
        onError: () => {
          setUserSelectedModeId(previousModeId);
          setAlertMessage(HOME_ERROR_MESSAGE.ACTIVATE_MODE);
        },
      });
    },
    [activateMode, isActivatingMode, userSelectedModeId],
  );

  // 화면은 mutation의 낙관적 캐시 업데이트로 즉시 토글되고, 실패하면 되돌아간다.
  const handleDoNotDisturbToggle = useCallback(() => {
    updateDoNotDisturb(!isDoNotDisturb);
  }, [isDoNotDisturb, updateDoNotDisturb]);

  const clearAlertMessage = useCallback(() => setAlertMessage(''), []);

  const contextValue = useMemo(
    () => ({
      selectedModeId,
      isModesLoading,
      isDoNotDisturb,
      isDoNotDisturbPending,
      isActivatingMode,
      alertMessage,
      handleModeActivate,
      handleDoNotDisturbToggle,
      clearAlertMessage,
    }),
    [
      alertMessage,
      clearAlertMessage,
      handleDoNotDisturbToggle,
      handleModeActivate,
      isActivatingMode,
      isDoNotDisturb,
      isDoNotDisturbPending,
      isModesLoading,
      selectedModeId,
    ],
  );

  return (
    <HomeModeContext.Provider value={contextValue}>
      {children}
    </HomeModeContext.Provider>
  );
};
// 현재 선택된 모드 ID를 여러 컴포넌트가 같이 사용할 수 있게 해주는 Context 파일
export const useHomeModeContext = () => {
  const context = useContext(HomeModeContext);

  if (!context) {
    throw new Error(
      'useHomeModeContext는 HomeModeProvider 안에서 사용해야 합니다',
    );
  }

  return context;
};
