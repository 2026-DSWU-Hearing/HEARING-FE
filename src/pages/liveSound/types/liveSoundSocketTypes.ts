// 실시간 소리 감지 WebSocket(/ws/users/me/livesound)의 메시지 타입.

// 필드명은 DetectionTypes와 같지만 구조가 달라(그쪽은 id/source/detected_at) 타입을 공유하지 않는다.
export interface LiveSoundSoundItemTypes {
  sound_id: number;
  sound_name: string;
  sound_category: string;
  confidence: number;
}

// 개별 감지 이벤트가 아니라 그 시점에 들리는 소리 전체를 담은 스냅샷이다.
// 매 초 최대 3개가 오고, 아무 소리도 없으면 sounds가 빈 배열로 온다.
export interface LiveSoundClassificationTypes {
  sounds: LiveSoundSoundItemTypes[];
  // 화면에 감지 시각을 표시하지 않아 값을 읽지 않는다.
  analyzed_at: string;
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
