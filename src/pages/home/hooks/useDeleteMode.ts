// 실제 서버 연결 이후 바꿀 로직
// import { useQueryClient, useMutation } from '@tanstack/react-query';
// import { deleteMode } from '@/pages/home/apis/deleteMode';

// export const useDeleteMode = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (modeId: number) => deleteMode(modeId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['modes'] });
//     },
//   });
// };

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMode } from '@/pages/home/apis/deleteMode';
import type { GetModesResponseTypes } from '@/pages/home/types/modeTypes';

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

      queryClient.removeQueries({ queryKey: ['modes', modeId] });

      // 실제 서버 연결 후에는 아래 방식으로 변경 가능
      // queryClient.invalidateQueries({ queryKey: ['modes'] });
    },
  });
};
