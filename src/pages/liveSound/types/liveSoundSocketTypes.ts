// 실시간 소리 감지 WebSocket(/ws/users/me/livesound)의 메시지 타입.
// envelope이 바뀌면 이 파일과 liveSoundProtocol.ts만 고치면 되게 격리했다.

// 주의: 기존 DetectionTypes는 sound_name / sound_category를 쓰는데 여기는 name / category다.
// 서버 스펙이 실제로 달라 두 타입을 섞어 쓰면 안 된다(백엔드에 통일 요청 예정).
export interface LiveSoundClassificationTypes {
  sound_id: number;
  name: string;
  category: string;
  confidence: number;
}

export interface LiveSoundReadyMessageTypes {
  type: 'ready';
}

export interface LiveSoundClassificationMessageTypes {
  type: 'classification';
  data: LiveSoundClassificationTypes;
}

export interface LiveSoundErrorMessageTypes {
  type: 'error';
  message?: string;
}

export type LiveSoundServerMessageTypes =
  | LiveSoundReadyMessageTypes
  | LiveSoundClassificationMessageTypes
  | LiveSoundErrorMessageTypes;

// 오디오 포맷은 스펙으로 합의된 값이라 매번 보내지 않는다.
export interface LiveSoundStartMessageTypes {
  type: 'start';
}

export interface LiveSoundStopMessageTypes {
  type: 'stop';
}

export type LiveSoundClientMessageTypes =
  | LiveSoundStartMessageTypes
  | LiveSoundStopMessageTypes;
