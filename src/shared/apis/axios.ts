import axios from 'axios';

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
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response Interceptor 설정 — 에러 공통 처리
http.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO(임시): 백엔드 인증 정상화 전까지 로컬 테스트를 위해 401 → /login 리다이렉트를 비활성화함.
    //            백엔드 auth(register/login) 복구 후 아래 블록 주석 해제하여 원복할 것.
    // if (error.response?.status === 401) {
    //   window.location.href = '/login'; // 로그인 페이지로 리다이렉션
    // }
    return Promise.reject(error); // 에러를 호출한 곳으로 전달
  },
);

export default http;
