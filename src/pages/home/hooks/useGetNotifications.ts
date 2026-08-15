import { useEffect } from 'react';
import { isAxiosError } from 'axios';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

import { getNotifications } from '@/pages/home/apis/getNotifications';
import { NOTIFICATION_QUERY_KEY } from '@/pages/home/constants/notificationConstants';

const isInvalidCursorError = (error: Error | null) =>
  isAxiosError(error) && error.response?.status === 422;

export const useGetNotifications = () => {
  const queryClient = useQueryClient();
  const notificationsQuery = useInfiniteQuery({
    queryKey: NOTIFICATION_QUERY_KEY,
    queryFn: ({ pageParam, signal }) => getNotifications(pageParam, signal),
    initialPageParam: null as string | null,
    getNextPageParam: ({ has_next: hasNext, next_cursor: nextCursor }) =>
      hasNext && nextCursor ? nextCursor : undefined,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: (failureCount, error) =>
      !isInvalidCursorError(error) && failureCount < 1,
  });

  const { error, isFetchNextPageError } = notificationsQuery;

  useEffect(() => {
    if (!isFetchNextPageError || !isInvalidCursorError(error)) return;

    // 서버가 만료되거나 잘못된 opaque cursor를 거절하면 활성 쿼리를 초기 상태로 되돌린다. resetQueries는 첫 페이지(pageParam: null)를 즉시 다시 요청한다.
    void queryClient.resetQueries({
      queryKey: NOTIFICATION_QUERY_KEY,
      exact: true,
    });
  }, [error, isFetchNextPageError, queryClient]);

  return notificationsQuery;
};
