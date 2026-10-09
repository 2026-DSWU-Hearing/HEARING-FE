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

          // 서버 응답의 sounds가 상세 조회와 같은 형태(category·is_active 포함)로 내려오므로
          // 그대로 반영한다. 유지된 소리의 is_active는 서버가 보존해 돌려준다.
          return {
            ...old,
            name: data.name,
            icon: data.icon,
            sounds: data.sounds,
          };
        },
      );
    },
  });
};
