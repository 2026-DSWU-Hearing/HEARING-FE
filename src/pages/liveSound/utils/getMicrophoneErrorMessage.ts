import { LIVE_SOUND_MESSAGE } from '../constants/liveSoundMessages';

// getUserMedia 실패 사유를 사용자가 행동할 수 있는 안내 문구로 바꾼다.
// DOMException.name은 브라우저 간 표준이라 name으로 분기한다.
export const getMicrophoneErrorMessage = (error: unknown): string => {
  if (!(error instanceof DOMException)) {
    return LIVE_SOUND_MESSAGE.MICROPHONE_FAILED;
  }

  switch (error.name) {
    // SecurityError는 구형 브라우저가 권한 거부에 쓰던 이름.
    case 'NotAllowedError':
    case 'SecurityError':
      return LIVE_SOUND_MESSAGE.PERMISSION_DENIED;

    case 'NotFoundError':
    case 'DevicesNotFoundError':
      return LIVE_SOUND_MESSAGE.DEVICE_NOT_FOUND;

    // TrackStartError는 Chrome이 하드웨어 점유 실패에 쓰던 옛 이름.
    case 'NotReadableError':
    case 'TrackStartError':
      return LIVE_SOUND_MESSAGE.DEVICE_IN_USE;

    default:
      return LIVE_SOUND_MESSAGE.MICROPHONE_FAILED;
  }
};
