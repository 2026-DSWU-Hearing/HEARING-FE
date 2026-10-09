import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postNotificationsDelete } from '@/pages/home/apis/postNotificationsDelete';
import {
  NOTIFICATION_DELETE_CHUNK_SIZE,
  NOTIFICATION_QUERY_KEY,
} from '@/pages/home/constants/notificationConstants';
import { filterNotificationsFromCache } from '@/pages/home/utils/notificationCache';

import type {
  NotificationDeleteResultTypes,
  NotificationInfiniteDataTypes,
} from '@/pages/home/types/notificationTypes';

const getNotificationIdChunks = (ids: number[]) => {
  const uniqueIds = Array.from(new Set(ids));

  return Array.from(
    { length: Math.ceil(uniqueIds.length / NOTIFICATION_DELETE_CHUNK_SIZE) },
    (_, chunkIndex) =>
      uniqueIds.slice(
        chunkIndex * NOTIFICATION_DELETE_CHUNK_SIZE,
        (chunkIndex + 1) * NOTIFICATION_DELETE_CHUNK_SIZE,
      ),
  );
};

export const useDeleteNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: async () => {
      // 진행 중인 무한 조회가 삭제 성공 뒤 이전 페이지 스냅샷으로 캐시를 덮어쓰지 않도록 요청을 먼저 취소한다.
      await queryClient.cancelQueries({
        queryKey: NOTIFICATION_QUERY_KEY,
        exact: true,
      });
    },
    mutationFn: async (
      ids: number[],
    ): Promise<NotificationDeleteResultTypes> => {
      const idChunks = getNotificationIdChunks(ids);
      const requestedIds = idChunks.flat();
      let deletedCount = 0;

      // API 최대 100개 제한을 지키고 서버 부하와 부분 성공 순서를 예측할 수 있도록 각 청크를 병렬이 아닌 순차적으로 전송한다.
      for (const idChunk of idChunks) {
        const response = await postNotificationsDelete({ ids: idChunk });
        deletedCount += response.deleted_count;
      }

      return { deletedCount, requestedIds };
    },
    onSuccess: ({ deletedCount, requestedIds }) => {
      const deletedIds = new Set(requestedIds);

      queryClient.setQueryData<NotificationInfiniteDataTypes>(
        NOTIFICATION_QUERY_KEY,
        (data) => filterNotificationsFromCache(data, deletedIds),
      );

      if (deletedCount !== requestedIds.length) {
        void queryClient.invalidateQueries({
          queryKey: NOTIFICATION_QUERY_KEY,
          exact: true,
        });
      }
    },
    onError: () => {
      // 앞선 청크는 성공하고 뒤 청크가 실패했을 수 있으므로 서버를 다시 조회한다.
      void queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEY,
        exact: true,
      });
    },
  });
};
