import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMode } from '@/pages/home/apis/deleteMode';
import type { GetModesResponseTypes } from '@/pages/home/types/modeTypes';

// 모드를 삭제하는 mutation 훅. 성공 시 목록 캐시에서 해당 모드를 제거한다.
export const useDeleteMode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (modeId: number) => deleteMode(modeId),

    onSuccess: (_, modeId) => {
      // 목록 캐시에서만 삭제된 모드를 제거한다.
      // 상세 쿼리(['modes', modeId])는 아직 화면에 active 상태일 수 있어 건드리지 않는다.
      // removeQueries로 비우면 active 옵저버가 삭제된 ID로 즉시 재조회해 404가 발생하기 때문.
      // 남은 상세 캐시는 구독 컴포넌트가 언마운트되면 gcTime 이후 자동 정리된다.
      queryClient.setQueryData<GetModesResponseTypes>(['modes'], (old) => {
        if (!old) return old;

        return {
          modes: old.modes.filter((mode) => mode.mode_id !== modeId),
        };
      });
    },
  });
};
