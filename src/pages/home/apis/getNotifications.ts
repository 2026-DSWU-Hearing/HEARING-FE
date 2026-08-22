import http from '@/shared/apis/axios';
import { NOTIFICATION_PAGE_SIZE } from '@/pages/home/constants/notificationConstants';

import type { NotificationListResponseTypes } from '@/pages/home/types/notificationTypes';

export const getNotifications = async (
  cursor: string | null,
  signal?: AbortSignal,
): Promise<NotificationListResponseTypes> => {
  const response = await http.get<NotificationListResponseTypes>(
    '/notifications',
    {
      params: {
        limit: NOTIFICATION_PAGE_SIZE,
        ...(cursor ? { cursor } : {}),
      },
      signal,
    },
  );

  return response.data;
};
