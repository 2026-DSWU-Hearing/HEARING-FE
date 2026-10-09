import type {
  UpdateDoNotDisturbRequestTypes,
  UserTypes,
} from '@/shared/types/userTypes';
import http from '@/shared/apis/axios';

export const patchDoNotDisturb = async (
  doNotDisturbData: UpdateDoNotDisturbRequestTypes,
): Promise<UserTypes> => {
  const response = await http.patch<UserTypes>(
    '/users/me/do-not-disturb',
    doNotDisturbData,
  );

  return response.data;
};
