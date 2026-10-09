import { useQueryClient, useMutation } from '@tanstack/react-query';
import { patchActivateMode } from '@/pages/home/apis/patchActivateMode';
import type { GetModesResponseTypes } from '@/pages/home/types/modeTypes';

// 모드를 활성화하는 mutation 훅.
// 목록 캐시를 먼저 바꿔 화면이 즉시 반응하고, 실패하면 이전 목록으로 되돌린다.
export const usePatchActivateMode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (modeId: number) => patchActivateMode(modeId),
    onMutate: async (modeId: number) => {
      // 진행 중인 목록 조회가 낙관적 값을 덮어쓰지 않도록 먼저 취소한다.
      await queryClient.cancelQueries({ queryKey: ['modes'], exact: true });

      const previousModes = queryClient.getQueryData<GetModesResponseTypes>([
        'modes',
      ]);
      // 낙관적 갱신 뒤에는 기존 활성 모드를 찾을 수 없으므로 갱신 전에 id를 확보한다.
      const previousActiveModeId = previousModes?.modes.find(
        (mode) => mode.is_active,
      )?.mode_id;

      queryClient.setQueryData<GetModesResponseTypes>(['modes'], (old) => {
        if (!old) return old;
        return {
          modes: old.modes.map((mode) => ({
            ...mode,
            is_active: mode.mode_id === modeId,
          })),
        };
      });

      return { previousModes, previousActiveModeId };
    },
    onError: (_error, _modeId, context) => {
      if (context?.previousModes) {
        queryClient.setQueryData<GetModesResponseTypes>(
          ['modes'],
          context.previousModes,
        );
      }
    },
    onSuccess: (data, _modeId, context) => {
      // 목록 캐시의 is_active만 갱신하면 ['modes', id] 상세 캐시와 활성 상태가 어긋난다.
      // 활성 상태가 바뀐 모드(새 활성 + 기존 활성)의 상세 캐시를 무효화해 다음 조회 시 서버 값으로 동기화한다.
      const previousActiveModeId = context?.previousActiveModeId;

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
