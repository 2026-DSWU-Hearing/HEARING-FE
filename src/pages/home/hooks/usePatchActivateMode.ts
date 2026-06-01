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

// 모드를 활성화하는 mutation 훅. 성공 시 캐시의 모든 모드에서 선택된 모드만 is_active로 갱신한다.
export const usePatchActivateMode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (modeId: number) => patchActivateMode(modeId),
    onSuccess: (data) => {
      queryClient.setQueryData<GetModesResponseTypes>(['modes'], (old) => {
        if (!old) return old;
        return old.map((mode) => ({
          ...mode,
          is_active: mode.id === data.id,
        }));
      });
    },
  });
};
