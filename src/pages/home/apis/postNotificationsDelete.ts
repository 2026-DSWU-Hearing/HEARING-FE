import http from '@/shared/apis/axios';

import type {
  NotificationDeleteRequestTypes,
  NotificationDeleteResponseTypes,
} from '@/pages/home/types/notificationTypes';

export const postNotificationsDelete = async (
  request: NotificationDeleteRequestTypes,
): Promise<NotificationDeleteResponseTypes> => {
  const response = await http.post<NotificationDeleteResponseTypes>(
    '/notifications/delete',
    request,
  );

  return response.data;
};
