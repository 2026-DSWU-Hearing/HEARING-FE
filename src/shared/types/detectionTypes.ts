// WebSocket(ws://.../ws/users/me/detections)으로 수신하는 실시간 소리 감지 알림 타입.
// 앱이 켜져 있을 때는 FCM이 아니라 이 WS 메시지로 인앱 알림을 띄운다.

// 소리가 감지된 방향. 넥밴드가 판별하지 못하면 UNKNOWN으로 온다(화면에는 표시하지 않는다).
export type DetectionDirectionTypes =
  | 'FRONT'
  | 'BACK'
  | 'LEFT'
  | 'RIGHT'
  | 'UNKNOWN';

export interface DetectionTypes {
  id: number;
  sound_name: string;
  sound_category: string;
  source: string;
  confidence: number | null;
  location: string | null;
  detected_at: string;
  direction: DetectionDirectionTypes;
  // 넥밴드가 서버 판정 전에 먼저 진동한(온디바이스 긴급 판정) 감지인지 여부.
  ondevice_vibrated: boolean;
}

export interface DetectionMessageTypes {
  type: 'detection';
  data: DetectionTypes;
}
