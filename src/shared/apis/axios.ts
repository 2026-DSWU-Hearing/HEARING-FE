import axios from 'axios';

import { getAccessToken, removeAuthTokens } from '@/pages/login/utils/tokenStorage';

const LOGIN_PATH = '/login';

const http = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL, //추후 env에 백 배포 url 추가
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

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
  (error) => {
    // 401은 토큰 만료/무효를 의미한다. 죽은 토큰을 지우지 않으면 로그인 페이지로
    // 리로드된 뒤에도 마운트 시 실행되는 요청들이 같은 토큰으로 다시 401을 맞아
    // 리로드→요청→401→리로드의 무한 루프에 빠진다.
    if (error.response?.status === 401) {
      removeAuthTokens();
      // 이미 로그인 페이지라면 리다이렉트하지 않는다. window.location.href는
      // SPA 전체를 리로드시키므로, 같은 경로로 반복 대입하면 화면이 깜빡이며
      // effect가 처음부터 다시 도는 원인이 된다.
      if (window.location.pathname !== LOGIN_PATH) {
        window.location.href = LOGIN_PATH;
      }
    }
    return Promise.reject(error); // 에러를 호출한 곳으로 전달
  },
);

export default http;
