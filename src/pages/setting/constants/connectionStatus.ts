/**
 * 디바이스 연결 상태(connection_status) 상수와 한글 라벨 매핑.
 * 서버와는 코드값(CONNECTED / DISCONNECTED)으로 주고받고, 화면에는 한글 라벨을 보여준다.
 * TODO(api): 실제 서버 스펙(코드값)이 확정되면 값만 맞춰 수정한다.
 */
export const CONNECTION_STATUS = {
  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED',
} as const;

export type ConnectionStatusTypes =
  (typeof CONNECTION_STATUS)[keyof typeof CONNECTION_STATUS];

export const CONNECTION_STATUS_LABEL: Record<ConnectionStatusTypes, string> = {
  [CONNECTION_STATUS.CONNECTED]: '연결됨',
  [CONNECTION_STATUS.DISCONNECTED]: '연결 끊김',
};
