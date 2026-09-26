import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { useGetUsers } from '@/shared/hooks/useGetUsers';
import { usePatchDoNotDisturb } from '@/shared/hooks/usePatchDoNotDisturb';

interface HomeModeProviderPropTypes {
  children: ReactNode;
}

interface HomeModeContextTypes {
  selectedModeId: number | null;
  isDoNotDisturb: boolean;
  isDoNotDisturbPending: boolean;
  handleModeSelect: (modeId: number) => void;
  handleDoNotDisturbToggle: () => void;
}

const HomeModeContext = createContext<HomeModeContextTypes | null>(null);

// 현재 선택된 모드 ID를 모드 목록과 소리 섹션이 함께 공유하도록 보관하는 Provider
export const HomeModeProvider = ({ children }: HomeModeProviderPropTypes) => {
  const [selectedModeId, setSelectedModeId] = useState<number | null>(null);
  const { data: user, isLoading: isUserLoading } = useGetUsers();
  const { mutate: updateDoNotDisturb, isPending: isPatchPending } =
    usePatchDoNotDisturb();

  // 방해금지 값은 서버(['users','me'] 캐시)가 단일 소스다.
  // 로컬 state로 들고 있으면 다른 탭으로 이동할 때 Provider가 언마운트되며 초기화된다.
  const isDoNotDisturb = user?.do_not_disturb ?? false;
  // 서버 값을 아직 못 받았을 때 토글하면 캐시가 비어 낙관적 업데이트가 건너뛰어지므로,
  // 첫 조회가 끝날 때까지도 버튼을 잠근다.
  const isDoNotDisturbPending = isPatchPending || isUserLoading;

  // 모드 선택 함수 - 선택된 모드는 모드 목록과 소리 섹션이 함께 사용한다
  const handleModeSelect = useCallback((modeId: number) => {
    setSelectedModeId(modeId);
  }, []);

  // 화면은 mutation의 낙관적 캐시 업데이트로 즉시 토글되고, 실패하면 되돌아간다.
  const handleDoNotDisturbToggle = useCallback(() => {
    updateDoNotDisturb(!isDoNotDisturb);
  }, [isDoNotDisturb, updateDoNotDisturb]);

  const contextValue = useMemo(
    () => ({
      selectedModeId,
      isDoNotDisturb,
      isDoNotDisturbPending,
      handleModeSelect,
      handleDoNotDisturbToggle,
    }),
    [
      handleDoNotDisturbToggle,
      handleModeSelect,
      isDoNotDisturb,
      isDoNotDisturbPending,
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
