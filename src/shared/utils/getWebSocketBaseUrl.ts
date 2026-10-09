// HTTP API base URL(VITE_APP_BASE_URL)을 WebSocket URL로 변환한다.
// http -> ws, https -> wss 로 프로토콜만 바꿔, 배포 환경(https)에서도 별도 env 없이 동작한다.
export const getWebSocketBaseUrl = () => {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  return baseUrl.replace(/^http/, 'ws');
};
