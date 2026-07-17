/**
 * 기기 등록 후 ESP32의 접속을 기다리는 최대 시간(ms).
 * 초과하면 무한 대기 대신 실패 안내로 전환해 사용자가 빠져나갈 수 있게 한다.
 * 설정 페이지와 온보딩이 같은 기준으로 기다리도록 공유한다.
 * TODO(hardware): ESP32 부팅 + WiFi 연결에 걸리는 실측 시간에 맞춰 조정할 것.
 */
export const DEVICE_CONNECT_TIMEOUT_MS = 30000;
