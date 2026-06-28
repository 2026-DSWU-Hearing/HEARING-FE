import type { UserTypes } from '@/shared/types/userTypes';
import http from '@/shared/apis/axios';

/** 내 정보 조회 */
export const getUsers = async (): Promise<UserTypes> => {
  const response = await http.get<UserTypes>('/users/me');

  return response.data;
};
