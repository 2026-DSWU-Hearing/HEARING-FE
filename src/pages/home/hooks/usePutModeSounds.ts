import { useMutation, useQueryClient } from '@tanstack/react-query';
import { putModeSounds } from '../apis/putModeSounds';
import type { GetModeDetailResponseTypes } from '@/pages/home/types/modeTypes';
import type { UpdateModeSoundsRequestTypes } from '@/pages/home/types/soundTypes';

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
      // 서버 응답의 sounds가 상세 조회와 같은 형태(category·is_active 포함)로 내려오므로
      // 그대로 상세 캐시에 반영한다. 유지된 소리의 is_active는 서버가 보존해 돌려준다.
      queryClient.setQueryData<GetModeDetailResponseTypes>(
        ['modes', data.mode_id],
        (old) => {
          if (!old) return old;

          return {
            ...old,
            sounds: data.sounds,
          };
        },
      );
    },
  });
};
