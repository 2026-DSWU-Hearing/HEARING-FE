import type { UpdateUsersRequestTypes } from '@/pages/setting/types/usersTypes';
import type { UserTypes } from '@/shared/types/userTypes';
import http from '@/shared/apis/axios';

/** 내 정보 수정 (닉네임, 장애 유형) */
export const patchUsers = async (
  usersData: UpdateUsersRequestTypes,
): Promise<UserTypes> => {
  const response = await http.patch<UserTypes>('/users/me', usersData);

  return response.data;
};
