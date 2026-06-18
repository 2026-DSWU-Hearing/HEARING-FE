import { useQueryClient, useMutation } from '@tanstack/react-query';
import { patchActivateMode } from '@/pages/home/apis/patchActivateMode';
import type { GetModesResponseTypes } from '@/pages/home/types/modeTypes';

// 모드를 활성화하는 mutation 훅. 성공 시 캐시의 모든 모드에서 선택된 모드만 is_active로 갱신한다.
export const usePatchActivateMode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (modeId: number) => patchActivateMode(modeId),
    onSuccess: (data) => {
      // 갱신 전 목록 캐시에서 기존 활성 모드 id를 먼저 확보한다.
      const previousModes = queryClient.getQueryData<GetModesResponseTypes>([
        'modes',
      ]);
      const previousActiveModeId = previousModes?.modes.find(
        (mode) => mode.is_active,
      )?.mode_id;

      queryClient.setQueryData<GetModesResponseTypes>(['modes'], (old) => {
        if (!old) return old;
        return {
          modes: old.modes.map((mode) => ({
            ...mode,
            is_active: mode.mode_id === data.mode_id,
          })),
        };
      });

      // 목록 캐시의 is_active만 갱신하면 ['modes', id] 상세 캐시와 활성 상태가 어긋난다.
      // 활성 상태가 바뀐 모드(새 활성 + 기존 활성)의 상세 캐시를 무효화해 다음 조회 시 서버 값으로 동기화한다.
      if (
        previousActiveModeId !== undefined &&
        previousActiveModeId !== data.mode_id
      ) {
        queryClient.invalidateQueries({
          queryKey: ['modes', previousActiveModeId],
        });
      }
      queryClient.invalidateQueries({ queryKey: ['modes', data.mode_id] });
    },
  });
};
