import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';

interface HomeModeProviderPropTypes {
  children: ReactNode;
}

interface HomeModeContextTypes {
  selectedModeId: number | null;
  handleModeSelect: (modeId: number) => void;
}

const HomeModeContext = createContext<HomeModeContextTypes | null>(null);

export const HomeModeProvider = ({ children }: HomeModeProviderPropTypes) => {
  const [selectedModeId, setSelectedModeId] = useState<number | null>(null);

  // 모드 선택 함수 - 선택된 모드는 모드 목록과 소리 섹션이 함께 사용한다
  const handleModeSelect = useCallback((modeId: number) => {
    setSelectedModeId(modeId);
  }, []);

  const contextValue = useMemo(
    () => ({
      selectedModeId,
      handleModeSelect,
    }),
    [handleModeSelect, selectedModeId],
  );

  return (
    <HomeModeContext.Provider value={contextValue}>
      {children}
    </HomeModeContext.Provider>
  );
};

export const useHomeModeContext = () => {
  const context = useContext(HomeModeContext);

  if (!context) {
    throw new Error(
      'useHomeModeContext는 HomeModeProvider 안에서 사용해야 합니다',
    );
  }

  return context;
};
