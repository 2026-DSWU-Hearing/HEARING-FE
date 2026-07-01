import axios from 'axios';

import type {
  GoogleAuthRequestTypes,
  GoogleAuthResponseTypes,
  GuestLoginResponseTypes,
} from '../types/loginTypes';

const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const postGoogleAuth = async ({
  id_token,
}: GoogleAuthRequestTypes): Promise<GoogleAuthResponseTypes> => {
  const response = await authApi.post<GoogleAuthResponseTypes>('/auth/google', {
    id_token,
  });

  return response.data;
};

export const postGuestLogin = async (): Promise<GuestLoginResponseTypes> => {
  const response = await authApi.post<GuestLoginResponseTypes>('/auth/guest');

  return response.data;
};
