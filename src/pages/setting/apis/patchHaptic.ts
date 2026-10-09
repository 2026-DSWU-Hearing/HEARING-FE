import type { UpdateHapticRequestTypes } from '@/pages/setting/types/usersTypes';
import type { UserTypes } from '@/shared/types/userTypes';
import http from '@/shared/apis/axios';

/** 진동 세기 수정 */
export const patchHaptic = async (
  hapticData: UpdateHapticRequestTypes,
): Promise<UserTypes> => {
  const response = await http.patch<UserTypes>('/users/me/haptic', hapticData);

  return response.data;
};
