import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UserTypes } from '@/shared/types/userTypes';
import { patchDoNotDisturb } from '@/shared/apis/patchDoNotDisturb';

// 방해금지 모드를 수정하는 mutation 훅.
// 화면은 캐시를 먼저 바꿔 즉시 반응하고, 실패하면 이전 값으로 되돌린다.
// 성공 시 ['users', 'me']를 무효화해 서버 값으로 동기화한다.
export const usePatchDoNotDisturb = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doNotDisturb: boolean) =>
      patchDoNotDisturb({ do_not_disturb: doNotDisturb }),
    onMutate: async (doNotDisturb: boolean) => {
      // 진행 중인 조회가 낙관적 값을 덮어쓰지 않도록 먼저 취소한다.
      await queryClient.cancelQueries({ queryKey: ['users', 'me'] });

      const previousUser = queryClient.getQueryData<UserTypes>(['users', 'me']);

      queryClient.setQueryData<UserTypes>(['users', 'me'], (old) =>
        old ? { ...old, do_not_disturb: doNotDisturb } : old,
      );

      return { previousUser };
    },
    onError: (_error, _doNotDisturb, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData<UserTypes>(
          ['users', 'me'],
          context.previousUser,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    },
  });
};
