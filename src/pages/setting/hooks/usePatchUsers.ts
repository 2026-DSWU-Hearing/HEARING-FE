import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchUsers } from '@/pages/setting/apis/patchUsers';

// 내 정보(닉네임, 장애 유형)를 수정하는 mutation 훅.
// 성공 시 ['users', 'me'] 캐시를 무효화해 서버 값으로 동기화한다.
export const usePatchUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchUsers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    },
  });
};
