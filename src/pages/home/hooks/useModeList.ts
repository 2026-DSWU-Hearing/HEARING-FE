import { useGetModes } from '@/pages/home/hooks/useGetModes';
import { useHomeModeContext } from '@/pages/home/hooks/useHomeModeContext';

// 홈 화면 모드 목록의 데이터/상태를 묶는 훅.
// 기본 선택(활성 모드)은 HomeModeProvider가 목록 데이터에서 파생값으로 정하므로 여기서는 effect로 맞추지 않는다.
export const useModeList = () => {
  const { selectedModeId, isDoNotDisturb } = useHomeModeContext();
  const { data, isLoading, isError } = useGetModes();

  return {
    modes: data?.modes ?? [],
    selectedModeId,
    isDoNotDisturb,
    isLoading,
    isError,
  };
};
