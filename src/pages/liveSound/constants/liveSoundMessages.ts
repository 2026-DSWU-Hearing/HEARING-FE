export const LIVE_SOUND_MESSAGE = {
  PERMISSION_DENIED:
    '마이크 권한이 거부되어 있어요.\n브라우저 설정에서 마이크 권한을 허용한 뒤 다시 시도해 주세요.',
  DEVICE_NOT_FOUND:
    '사용할 수 있는 마이크를 찾지 못했어요.\n마이크가 연결되어 있는지 확인해 주세요.',
  DEVICE_IN_USE:
    '다른 앱이 마이크를 사용하고 있어요.\n해당 앱을 종료한 뒤 다시 시도해 주세요.',
  MICROPHONE_FAILED: '마이크를 시작하지 못했어요.\n잠시 후 다시 시도해 주세요.',
  CONNECT_FAILED:
    '실시간 감지 서버에 연결하지 못했어요.\n네트워크 상태를 확인한 뒤 다시 시도해 주세요.',
  AUTH_FAILED: '로그인이 만료되었어요.\n다시 로그인한 뒤 이용해 주세요.',
  CONNECTION_LOST:
    '실시간 감지 연결이 끊겼어요.\n시작 버튼을 눌러 다시 시도해 주세요.',
  SERVER_ERROR:
    '실시간 감지 중 오류가 발생했어요.\n잠시 후 다시 시도해 주세요.',
  NOT_SUPPORTED:
    '이 브라우저에서는 실시간 감지를 사용할 수 없어요.\n다른 브라우저에서 시도해 주세요.',
} as const;
