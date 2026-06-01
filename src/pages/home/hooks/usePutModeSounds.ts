// 실제 서버 연결 이후 바꿀 로직
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import type { UpdateModeSoundsRequestTypes } from '@/pages/home/types/soundTypes';
// import { putModeSounds } from '../apis/putModeSounds';

// export const usePutModeSounds = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({
//       modeId,
//       soundsData,
//     }: {
//       modeId: number;
//       soundsData: UpdateModeSoundsRequestTypes;
//     }) => putModeSounds(modeId, soundsData),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: ['modes'] });
//       queryClient.invalidateQueries({ queryKey: ['modes', variables.modeId] });
//     },
//   });
// };

// src/pages/home/hooks/usePutModeSounds.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { putModeSounds } from '../apis/putModeSounds';
import type {
  GetModeDetailResponseTypes,
  GetModesResponseTypes,
} from '@/pages/home/types/modeTypes';
import type { UpdateModeSoundsRequestTypes } from '@/pages/home/types/soundTypes';

// 모드에 담긴 소리 목록을 수정/저장하는 mutation 훅. 서버 응답(완전한 모드 객체)으로 캐시를 갱신한다.
export const usePutModeSounds = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      modeId,
      soundsData,
    }: {
      modeId: number;
      soundsData: UpdateModeSoundsRequestTypes;
    }) => putModeSounds(modeId, soundsData),

    onSuccess: (data) => {
      queryClient.setQueryData<GetModeDetailResponseTypes>(
        ['modes', data.id],
        data,
      );

      // 목록 캐시의 해당 모드 sounds 도 함께 갱신한다.
      queryClient.setQueryData<GetModesResponseTypes>(['modes'], (old) => {
        if (!old) return old;

        return old.map((mode) => (mode.id === data.id ? data : mode));
      });
    },
  });
};
