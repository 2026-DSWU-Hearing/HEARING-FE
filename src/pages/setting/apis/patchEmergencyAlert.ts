import type { UpdateEmergencyAlertRequestTypes } from '@/pages/setting/types/usersTypes';
import type { UserTypes } from '@/shared/types/userTypes';
import http from '@/shared/apis/axios';

/** 긴급 소리 알림 on/off */
export const patchEmergencyAlert = async (
  emergencyAlertData: UpdateEmergencyAlertRequestTypes,
): Promise<UserTypes> => {
  const response = await http.patch<UserTypes>(
    '/users/me/emergency-alert',
    emergencyAlertData,
  );

  return response.data;
};
