import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchEmergencyAlert } from '@/pages/setting/apis/patchEmergencyAlert';

// 긴급 소리 알림 on/off를 수정하는 mutation 훅.
// 성공 시 ['users', 'me'] 캐시를 무효화해 서버 값으로 동기화한다.
export const usePatchEmergencyAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchEmergencyAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    },
  });
};
