import type { UpdatePushEnabledRequestTypes } from '@/pages/setting/types/usersTypes';
import type { UserTypes } from '@/shared/types/userTypes';
import http from '@/shared/apis/axios';

/** 푸시 알림 on/off */
export const patchPushEnabled = async (
  pushEnabledData: UpdatePushEnabledRequestTypes,
): Promise<UserTypes> => {
  const response = await http.patch<UserTypes>(
    '/users/me/push-enabled',
    pushEnabledData,
  );

  return response.data;
};
