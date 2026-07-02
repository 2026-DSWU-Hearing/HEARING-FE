import http from '@/shared/apis/axios';

import type {
  GoogleAuthRequestTypes,
  GoogleAuthResponseTypes,
  GuestLoginResponseTypes,
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
