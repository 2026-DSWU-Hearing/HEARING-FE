import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60, // 1분 후 stale 상태로 간주
      refetchOnWindowFocus: false, // 브라우저 창이 다시 focus될 때 자동으로 refetch하지 않도록 설정
    },
  },
});
