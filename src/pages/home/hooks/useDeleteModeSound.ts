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
import type { GetModeDetailResponseTypes } from '@/pages/home/types/modeTypes';

export const useDeleteModeSound = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ modeId, soundId }: { modeId: number; soundId: number }) =>
      deleteModeSound(modeId, soundId),

    onSuccess: (_, variables) => {
      queryClient.setQueryData<GetModeDetailResponseTypes>(
        ['modes', variables.modeId],
        (old) => {
          if (!old) return old;

          return {
            ...old,
            sounds: old.sounds.filter(
              (sound) => sound.sound_id !== variables.soundId,
            ),
          };
        },
      );

      // 실제 서버 연결 후에는 아래 방식으로 변경 가능
      // queryClient.invalidateQueries({
      //   queryKey: ['modes', variables.modeId],
      // });
    },
  });
};
