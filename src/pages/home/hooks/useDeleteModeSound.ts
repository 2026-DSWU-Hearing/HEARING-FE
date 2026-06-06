// 실제 서버 연결 이후 바꿀 로직
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { deleteModeSound } from '../apis/deleteModeSound';

// export const useDeleteModeSound = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ modeId, soundId }: { modeId: number; soundId: number }) =>
//       deleteModeSound(modeId, soundId),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: ['modes'] });
//       queryClient.invalidateQueries({ queryKey: ['modes', variables.modeId] });
//     },
//   });
// };

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteModeSound } from '../apis/deleteModeSound';
import type {
  GetModeDetailResponseTypes,
  GetModesResponseTypes,
} from '@/pages/home/types/modeTypes';

// 모드에 담긴 소리를 삭제하는 mutation 훅. 개별 삭제 API가 없어 "남길 소리 id 목록"으로 전체 교체한다.
export const useDeleteModeSound = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      modeId,
      remainingSoundIds,
    }: {
      modeId: number;
      remainingSoundIds: number[];
    }) => deleteModeSound(modeId, remainingSoundIds),

    onSuccess: (data) => {
      // 서버 응답(data)이 갱신된 완전한 모드 객체이므로 상세/목록 캐시에 그대로 반영한다.
      queryClient.setQueryData<GetModeDetailResponseTypes>(
        ['modes', data.id],
        data,
      );

      queryClient.setQueryData<GetModesResponseTypes>(['modes'], (old) => {
        if (!old) return old;

        return old.map((mode) => (mode.id === data.id ? data : mode));
      });
    },
  });
};
