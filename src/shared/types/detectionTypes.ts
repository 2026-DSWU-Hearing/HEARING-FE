// WebSocket(ws://.../ws/users/me/detections)으로 수신하는 실시간 소리 감지 알림 타입.
// 앱이 켜져 있을 때는 FCM이 아니라 이 WS 메시지로 인앱 알림을 띄운다.

export interface DetectionTypes {
  id: number;
  sound_name: string;
  sound_category: string;
  source: string;
  confidence: number;
  location: string | null;
  detected_at: string;
}

export interface DetectionMessageTypes {
  type: 'detection';
  data: DetectionTypes;
}
