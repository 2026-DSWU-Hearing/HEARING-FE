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
import type {
  GetSoundsResponseTypes,
  UpdateModeSoundsRequestTypes,
} from '@/pages/home/types/soundTypes';

// 모드에 담긴 소리 목록을 수정/저장하는 mutation 훅
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
      const soundsData = queryClient.getQueryData<GetSoundsResponseTypes>([
        'sounds',
      ]);

      queryClient.setQueryData<GetModeDetailResponseTypes>(
        ['modes', data.mode_id],
        (old) => {
          if (!old) return old;

          // 서버 응답(data.sounds)에는 category가 없으므로, 기존 상세 캐시(oldSound) →
          // 전체 소리 목록 캐시(currentSound) 순서로 category를 복원해 카드 표시가 깨지지 않게 한다.
          return {
            ...old,
            sounds: data.sounds.map((sound) => {
              const oldSound = old.sounds.find(
                (item) => item.sound_id === sound.sound_id,
              );
              const currentSound = soundsData?.sounds.find(
                (item) => item.sound_id === sound.sound_id,
              );

              return {
                ...sound,
                category:
                  oldSound?.category ?? currentSound?.category_name ?? '',
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
