import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
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
  const [isDoNotDisturb, setIsDoNotDisturb] = useState(false);
  const { mutate: updateDoNotDisturb, isPending: isDoNotDisturbPending } =
    usePatchDoNotDisturb();

  // 모드 선택 함수 - 선택된 모드는 모드 목록과 소리 섹션이 함께 사용한다
  const handleModeSelect = useCallback((modeId: number) => {
    setSelectedModeId(modeId);
  }, []);

  const handleDoNotDisturbToggle = useCallback(() => {
    setIsDoNotDisturb((prevIsDoNotDisturb) => {
      const nextIsDoNotDisturb = !prevIsDoNotDisturb;

      // 화면은 즉시 토글하고, 서버 반영에 실패하면 이전 상태로 되돌린다.
      updateDoNotDisturb(nextIsDoNotDisturb, {
        onError: () => {
          setIsDoNotDisturb(prevIsDoNotDisturb);
        },
      });

      return nextIsDoNotDisturb;
    });
  }, [updateDoNotDisturb]);

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
