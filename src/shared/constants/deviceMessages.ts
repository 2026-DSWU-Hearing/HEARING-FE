export const DEVICE_MESSAGE = {
  CONNECTING_BUTTON: '연결 중...',
  /** 409: 기기가 서버에 접속해 있지 않음(하드웨어 쪽 문제) */
  CONNECT_FAILED:
    '디바이스를 찾지 못했어요.\n전원과 Wi-Fi 연결을 확인한 뒤 다시 시도해 주세요.',
  /** 409 외(5xx·네트워크 등): 하드웨어가 아니라 요청 자체가 실패함 */
  CONNECT_REQUEST_FAILED:
    '연결 요청에 실패했어요.\n잠시 후 다시 시도해 주세요.',
  NOT_ACTIVE_USER:
    '기기가 다른 계정에 연결되어 있어요.\n내 설정으로 사용하려면 아래 버튼을 눌러 주세요.',
  RENAME_FAILED: '기기 이름 저장에 실패했어요.\n잠시 후 다시 시도해 주세요.',
  DISCONNECT_FAILED:
    '기기 연결 해제에 실패했어요.\n잠시 후 다시 시도해 주세요.',
} as const;
