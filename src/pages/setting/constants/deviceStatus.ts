/**
 * 디바이스 상태(배터리·연결) 폴링 주기(ms).
 * 배터리/연결 상태는 하드웨어→백엔드로 갱신되므로, 프론트는 GET /devices를
 * 이 주기로 재조회해 최신값을 화면에 반영한다. 저빈도 상태값이라 5초면 체감 실시간성에 충분하다.
 */
export const DEVICE_STATUS_POLLING_INTERVAL_MS = 5000;
