import { useEffect } from 'react';
import { useGetModes } from '@/pages/home/hooks/useGetModes';
import { useHomeModeContext } from '@/pages/home/hooks/useHomeModeContext';

// 홈 화면 모드 목록의 데이터/상태를 묶는 훅. 첫 진입 시 활성 모드(없으면 첫 모드)를 기본 선택해준다.
export const useModeList = () => {
  const { selectedModeId, isDoNotDisturb, handleModeSelect } =
    useHomeModeContext();
  const { data, isLoading, isError } = useGetModes();

  useEffect(() => {
    if (!data?.modes.length || selectedModeId !== null) return;

    // 서버의 활성 모드를 우선 선택하고, 없으면 첫 번째 모드를 기본 선택한다.
    const activeMode = data.modes.find((mode) => mode.is_active);
    const defaultMode = activeMode ?? data.modes[0];

    handleModeSelect(defaultMode.mode_id);
  }, [data?.modes, handleModeSelect, selectedModeId]);

  return {
    modes: data?.modes ?? [],
    selectedModeId,
    isDoNotDisturb,
    isLoading,
    isError,
  };
};
