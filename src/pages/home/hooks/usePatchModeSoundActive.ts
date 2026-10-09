import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchModeSoundActive } from '@/pages/home/apis/patchModeSoundActive';
import type { GetModeDetailResponseTypes } from '@/pages/home/types/modeTypes';

interface PatchModeSoundActiveParamTypes {
  modeId: number;
  soundId: number;
  isActive: boolean;
}

export const usePatchModeSoundActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      modeId,
      soundId,
      isActive,
    }: PatchModeSoundActiveParamTypes) =>
      patchModeSoundActive(modeId, soundId, { is_active: isActive }),
    onSuccess: (data) => {
      queryClient.setQueryData<GetModeDetailResponseTypes>(
        ['modes', data.mode_id],
        (old) => {
          if (!old) return old;

          return {
            ...old,
            sounds: old.sounds.map((sound) =>
              sound.sound_id === data.sound_id
                ? { ...sound, is_active: data.is_active }
                : sound,
            ),
          };
        },
      );
    },
  });
};
