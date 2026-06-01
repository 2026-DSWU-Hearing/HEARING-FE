import { useEffect } from 'react';
import { useGetModes } from '@/pages/home/hooks/useGetModes';
import { useHomeModeContext } from '@/pages/home/hooks/useHomeModeContext';

// 홈 화면 모드 목록의 데이터/상태를 묶는 훅. 첫 진입 시 활성 모드(없으면 첫 모드)를 기본 선택해준다.
export const useModeList = () => {
  const { selectedModeId, handleModeSelect } = useHomeModeContext();
  const { data, isLoading, isError } = useGetModes();

  useEffect(() => {
    if (!data?.length || selectedModeId !== null) return;

    // 서버의 활성 모드를 우선 선택하고, 없으면 첫 번째 모드를 기본 선택한다.
    const activeMode = data.find((mode) => mode.is_active);
    const defaultMode = activeMode ?? data[0];

    handleModeSelect(defaultMode.id);
  }, [data, handleModeSelect, selectedModeId]);

  return {
    modes: data ?? [],
    selectedModeId,
    isLoading,
    isError,
  };
};
