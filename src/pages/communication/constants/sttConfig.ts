import { getWebSocketBaseUrl } from '@/shared/utils/getWebSocketBaseUrl';

// 백엔드 STT 중계 소켓 설정.
// RTZR 토큰 발급과 중계는 서버가 전담하므로 프론트는 대화 id와 액세스 토큰만 있으면 된다.
// 마이크 캡처 규격(16kHz mono PCM int16, 100ms 청크)은 실시간 소리 화면과 동일해서
// liveSound의 createAudioCapture를 그대로 재사용한다.

// 오디오 전송이 끝났음을 알리는 텍스트 프레임. 이걸 보내야 마지막 문장의 final이 내려온다.
export const STT_EOS_MESSAGE = 'EOS';

// EOS를 보낸 뒤 마지막 final 결과를 기다리는 최대 시간(ms).
// 이 시간이 지나면 서버가 닫지 않아도 우리가 소켓을 닫는다.
export const STT_FINAL_WAIT_MS = 3000;

// 소켓 송신 큐가 이 크기(약 1초치)를 넘으면 전송이 밀린 것으로 보고 청크를 버린다.
// 밀린 오디오를 계속 쌓으면 인식 결과가 실제 발화보다 점점 뒤처진다.
export const STT_MAX_BUFFERED_AMOUNT = 32000;

export const STT_MESSAGE = {
  TOKEN_FAILED: '음성 인식 서버에 연결하지 못했습니다.',
  SOCKET_FAILED: '음성 인식 연결이 끊어졌습니다.',
  SERVER_CLOSED: '음성 인식이 중단되었습니다. 다시 시도해 주세요.',
  NO_SPEECH: '음성을 인식하지 못했습니다.',
} as const;

export const STT_SERVER_CLOSE_CODE_MIN = 4000;

export const STT_CLOSE_CODE = {
  UNAUTHORIZED: 4401,
  NOT_FOUND: 4404,
  ALREADY_ENDED: 4409,
  UNAVAILABLE: 4503,
} as const;

export const STT_CLOSE_MESSAGE: Record<number, string> = {
  [STT_CLOSE_CODE.UNAUTHORIZED]:
    '로그인이 만료되었습니다. 다시 로그인해 주세요.',
  [STT_CLOSE_CODE.NOT_FOUND]: '대화를 찾을 수 없습니다. 다시 시도해 주세요.',
  [STT_CLOSE_CODE.ALREADY_ENDED]:
    '이미 종료된 대화입니다. 다시 시도하면 새 대화로 시작합니다.',
  [STT_CLOSE_CODE.UNAVAILABLE]:
    '음성 인식 서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.',
};

export const STT_CONVERSATION_UNAVAILABLE_CLOSE_CODES: readonly number[] = [
  STT_CLOSE_CODE.NOT_FOUND,
  STT_CLOSE_CODE.ALREADY_ENDED,
];

// 브라우저가 붙을 STT 소켓 주소를 만든다.
// 인증 방식은 기존 감지 소켓(/ws/users/me/detections)과 동일하게 쿼리 토큰을 쓴다.
export const buildSttStreamUrl = (
  conversationId: number,
  accessToken: string,
): string => {
  // 토큰에 쿼리스트링 예약 문자(+, /, = 등)가 있어도 깨지지 않도록 인코딩한다.
  const encodedToken = encodeURIComponent(accessToken);

  return `${getWebSocketBaseUrl()}/ws/conversations/${conversationId}/stt?token=${encodedToken}`;
};
