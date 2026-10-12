import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60, // 1분 후 stale 상태로 간주
      refetchOnWindowFocus: false, // 브라우저 창이 다시 focus될 때 자동으로 refetch하지 않도록 설정
    },
    mutations: {
      // 기본값 'online'은 오프라인이면 mutationFn을 실행조차 하지 않고 일시정지시킨다.
      // 그러면 isPending이 영원히 true로 남아 onError/onSettled/catch가 전부 실행되지 않고,
      // 로그아웃·설정 저장 같은 화면이 로딩에서 빠져나오지 못한다.
      // 'always'로 두면 요청이 즉시 실패(네트워크 에러·axios timeout)해 기존 에러 처리가 동작한다.
      networkMode: 'always',
    },
  },
});
