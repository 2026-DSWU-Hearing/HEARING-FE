import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchPushEnabled } from '@/pages/setting/apis/patchPushEnabled';

// 푸시 알림 on/off를 수정하는 mutation 훅.
// 성공 시 ['users', 'me'] 캐시를 무효화해 서버 값으로 동기화한다.
export const usePatchPushEnabled = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchPushEnabled,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    },
  });
};
