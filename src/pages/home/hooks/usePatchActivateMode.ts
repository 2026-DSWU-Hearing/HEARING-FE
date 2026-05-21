// 나중에 서버 연결 후 이렇게 바꾸기
// import { useQueryClient, useMutation } from '@tanstack/react-query';
// import { patchActivateMode } from '@/pages/home/apis/patchActivateMode';

// export const usePatchActivateMode = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (modeId: number) => patchActivateMode(modeId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['modes'] });
//     },
//   });
// };

import { useQueryClient, useMutation } from '@tanstack/react-query';
import { patchActivateMode } from '@/pages/home/apis/patchActivateMode';
import type { GetModesResponseTypes } from '@/pages/home/types/modeTypes';

export const usePatchActivateMode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (modeId: number) => patchActivateMode(modeId),
    onSuccess: (data) => {
      queryClient.setQueryData<GetModesResponseTypes>(['modes'], (old) => {
        if (!old) return old;
        return {
          modes: old.modes.map((mode) => ({
            ...mode,
            is_active: mode.mode_id === data.mode_id,
          })),
        };
      });
    },
  });
};
