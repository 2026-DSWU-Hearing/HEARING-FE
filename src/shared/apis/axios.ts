import axios from 'axios';

import {
  getAccessToken,
  getRefreshToken,
  removeAuthTokens,
  setAuthTokens,
} from '@/pages/login/utils/tokenStorage';

import type { AuthTokenResponseTypes } from '@/pages/login/types/loginTypes';
import type { InternalAxiosRequestConfig } from 'axios';

interface RetryableRequestConfigTypes extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const LOGIN_PATH = '/login';

const http = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL, //추후 env에 백 배포 url 추가
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const postRefreshToken = async (refreshToken: string): Promise<AuthTokenResponseTypes> => {
  const response = await refreshClient.post<AuthTokenResponseTypes>('/auth/refresh', {
    refresh_token: refreshToken,
  });
  return response.data;
};

const redirectToLogin = () => {
  removeAuthTokens();
  // 이미 로그인 페이지라면 리다이렉트하지 않는다. window.location.href는
  // SPA 전체를 리로드시키므로, 같은 경로로 반복 대입하면 화면이 깜빡이며
  // effect가 처음부터 다시 도는 원인이 된다.
  if (window.location.pathname !== LOGIN_PATH) {
    window.location.href = LOGIN_PATH;
  }
};

let refreshPromise: Promise<string | null> | null = null;

export const refreshAccessToken = (): Promise<string | null> => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) return null;

      try {
        const { access_token, refresh_token } = await postRefreshToken(refreshToken);
        setAuthTokens(access_token, refresh_token);
        return access_token;
      } catch {
        return null;
      }
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

// Request Interceptor 설정
http.interceptors.request.use((config) => {
  // 서버에 요청 전에 localStorage에서 토큰을 가져와 헤더에 추가
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response Interceptor 설정 — 에러 공통 처리
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableRequestConfigTypes | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return http(originalRequest);
      }

      redirectToLogin();
    }

    return Promise.reject(error); // 에러를 호출한 곳으로 전달
  },
);

export default http;
