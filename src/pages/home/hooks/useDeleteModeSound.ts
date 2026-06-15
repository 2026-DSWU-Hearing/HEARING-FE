import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteModeSound } from '../apis/deleteModeSound';
import type { GetModeDetailResponseTypes } from '@/pages/home/types/modeTypes';

// 모드에 담긴 특정 소리를 삭제하는 mutation 훅
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
    },
  });
};
