/**
 * 디바이스 상태(배터리·연결) 폴링 주기(ms).
 * 배터리/연결 상태는 하드웨어→백엔드로 갱신되므로, 프론트는 GET /devices를
 * 이 주기로 재조회해 최신값을 화면에 반영한다. 저빈도 상태값이라 5초면 체감 실시간성에 충분하다.
 */
export const DEVICE_STATUS_POLLING_INTERVAL_MS = 5000;

/**
 * 기기 등록 후 ESP32의 접속을 기다리는 최대 시간(ms).
 * 초과하면 무한 대기 대신 실패 안내로 전환해 사용자가 빠져나갈 수 있게 한다.
 * TODO(hardware): ESP32 부팅 + WiFi 연결에 걸리는 실측 시간에 맞춰 조정할 것.
 */
export const DEVICE_CONNECT_TIMEOUT_MS = 30000;
