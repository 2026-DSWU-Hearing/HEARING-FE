import { useMutation, useQueryClient } from '@tanstack/react-query';
import { putMode } from '@/pages/home/apis/putMode';
import type {
  GetModeDetailResponseTypes,
  GetModesResponseTypes,
  UpdateModeRequestTypes,
} from '@/pages/home/types/modeTypes';

// 모드의 이름/아이콘/소리를 수정하는 mutation 훅. 성공 시 목록 캐시와 상세 캐시를 함께 갱신한다.
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
      queryClient.setQueryData<GetModesResponseTypes>(['modes'], (old) => {
        if (!old) return old;

        return {
          modes: old.modes.map((mode) =>
            mode.mode_id === data.mode_id
              ? {
                  ...mode,
                  name: data.name,
                  icon: data.icon,
                }
              : mode,
          ),
        };
      });

      queryClient.setQueryData<GetModeDetailResponseTypes>(
        ['modes', data.mode_id],
        (old) => {
          if (!old) return old;

          return {
            ...old,
            name: data.name,
            icon: data.icon,
            sounds: data.sounds.map((sound) => {
              const oldSound = old.sounds.find(
                (item) => item.sound_id === sound.sound_id,
              );

              return {
                ...sound,
                category: oldSound?.category ?? '',
                is_active: oldSound?.is_active ?? true,
              };
            }),
          };
        },
      );
    },
  });
};
