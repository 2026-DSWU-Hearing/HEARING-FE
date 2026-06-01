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

// 모드를 삭제하는 mutation 훅. 성공 시 목록 캐시에서 제거하고 해당 모드의 상세 캐시도 비운다.
export const useDeleteMode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (modeId: number) => deleteMode(modeId),

    onSuccess: (_, modeId) => {
      queryClient.setQueryData<GetModesResponseTypes>(['modes'], (old) => {
        if (!old) return old;

        return old.filter((mode) => mode.id !== modeId);
      });

      queryClient.removeQueries({ queryKey: ['modes', modeId] });
    },
  });
};
