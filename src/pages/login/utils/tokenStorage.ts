import {
  ACCESS_TOKEN_KEY,
  LOGIN_TYPE_KEY,
  REFRESH_TOKEN_KEY,
} from '@/pages/login/constants/loginConstants';

import type { LoginTypeTypes } from '@/pages/login/types/loginTypes';

export const setAuthTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const setLoginType = (loginType: LoginTypeTypes) => {
  localStorage.setItem(LOGIN_TYPE_KEY, loginType);
};

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const removeAuthTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(LOGIN_TYPE_KEY);
};
