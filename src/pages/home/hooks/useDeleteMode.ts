import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMode } from '@/pages/home/apis/deleteMode';
import type { GetModesResponseTypes } from '@/pages/home/types/modeTypes';

// 모드를 삭제하는 mutation 훅. 성공 시 목록 캐시에서 해당 모드를 제거한다.
export const useDeleteMode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (modeId: number) => deleteMode(modeId),

    onSuccess: (_, modeId) => {
      queryClient.setQueryData<GetModesResponseTypes>(['modes'], (old) => {
        if (!old) return old;

        return {
          modes: old.modes.filter((mode) => mode.mode_id !== modeId),
        };
      });
    },
  });
};
