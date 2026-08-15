// 실시간 소리 감지 상태.
// idle: 감지 전 / connecting: WebSocket 연결 중 / listening: 감지 중 / error: 연결 실패
export type LiveSoundStatusTypes =
  | 'idle'
  | 'connecting'
  | 'listening'
  | 'error';
