// 실제 서버 연결 후 바꿀 로직
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import type { UpdateModeRequestTypes } from '@/pages/home/types/modeTypes';
// import { putMode } from '@/pages/home/apis/putMode';

// export const usePutMode = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({
//       modeId,
//       modeData,
//     }: {
//       modeId: number;
//       modeData: UpdateModeRequestTypes;
//     }) => putMode(modeId, modeData),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: ['modes'] });
//       queryClient.invalidateQueries({
//         queryKey: ['modes', variables.modeId],
//       });
//     },
//   });
// };

// src/pages/home/hooks/usePutMode.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { putMode } from '@/pages/home/apis/putMode';
import type {
  GetModeDetailResponseTypes,
  GetModesResponseTypes,
  UpdateModeRequestTypes,
} from '@/pages/home/types/modeTypes';

// 모드의 이름/아이콘을 수정하는 mutation 훅. 성공 시 서버 응답으로 목록/상세 캐시를 갱신한다.
export const usePutMode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      modeId,
      modeData,
    }: {
      modeId: number;
      modeData: UpdateModeRequestTypes;
    }) => putMode(modeId, modeData),

    onSuccess: (data) => {
      // 서버 응답(data)이 완전한 모드 객체이므로 목록/상세 캐시 모두 그대로 반영한다.
      queryClient.setQueryData<GetModesResponseTypes>(['modes'], (old) => {
        if (!old) return old;

        return old.map((mode) => (mode.id === data.id ? data : mode));
      });

      queryClient.setQueryData<GetModeDetailResponseTypes>(
        ['modes', data.id],
        data,
      );
    },
  });
};
