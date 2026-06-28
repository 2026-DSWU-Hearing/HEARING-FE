import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchHaptic } from '@/pages/setting/apis/patchHaptic';

// 진동 세기를 수정하는 mutation 훅.
// 성공 시 ['users', 'me'] 캐시를 무효화해 서버 값으로 동기화한다.
export const usePatchHaptic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchHaptic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    },
  });
};
