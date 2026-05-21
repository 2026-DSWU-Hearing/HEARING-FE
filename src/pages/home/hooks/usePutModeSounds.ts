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
import type { GetModeDetailResponseTypes } from '@/pages/home/types/modeTypes';
import type { UpdateModeSoundsRequestTypes } from '@/pages/home/types/soundTypes';

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
        ['modes', data.mode_id],
        (old) => {
          if (!old) return old;

          return {
            ...old,
            sounds: data.sounds.map((sound) => {
              const oldSound = old.sounds.find(
                (item) => item.sound_id === sound.sound_id,
              );

              return {
                ...sound,
                category: oldSound?.category ?? '',
              };
            }),
          };
        },
      );

      // 실제 서버 연결 후에는 아래 방식으로 변경 가능
      // queryClient.invalidateQueries({ queryKey: ['modes', data.mode_id] });
    },
  });
};
