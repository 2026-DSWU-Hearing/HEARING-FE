import http from '@/shared/apis/axios';

import { getRefreshToken } from '@/pages/login/utils/tokenStorage';

import type {
  GoogleAuthRequestTypes,
  GoogleAuthResponseTypes,
  GuestLoginResponseTypes,
  LogoutRequestTypes,
} from '@/pages/login/types/loginTypes';

export const postGoogleAuth = async ({
  id_token,
}: GoogleAuthRequestTypes): Promise<GoogleAuthResponseTypes> => {
  const response = await http.post<GoogleAuthResponseTypes>('/auth/google', {
    id_token,
  });

  return response.data;
};

export const postGuestLogin = async (): Promise<GuestLoginResponseTypes> => {
  const response = await http.post<GuestLoginResponseTypes>('/auth/guest');

  return response.data;
};

/**
 * 로그아웃. refresh_token을 보내면 서버가 남은 수명 동안 블랙리스트에 올려
 * 재발급을 차단한다. 저장된 refresh_token이 없으면 body 없이 호출하며,
 * 이 경우 서버는 클라이언트 측 토큰 폐기만 하고 성공을 반환한다.
 */
export const postLogout = async (): Promise<void> => {
  const refreshToken = getRefreshToken();
  const body: LogoutRequestTypes | undefined = refreshToken
    ? { refresh_token: refreshToken }
    : undefined;

  await http.post('/auth/logout', body);
};
