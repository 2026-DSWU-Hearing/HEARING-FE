import axios from 'axios';

import type {
  GoogleAuthRequestTypes,
  GoogleAuthResponseTypes,
} from '../types/loginTypes';

const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const postGoogleAuth = async ({
  id_token,
}: GoogleAuthRequestTypes): Promise<GoogleAuthResponseTypes> => {
  const response = await authApi.post<GoogleAuthResponseTypes>('/auth/google', {
    id_token,
  });

  return response.data;
};
