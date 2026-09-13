import { TARGET_SAMPLE_RATE } from '@/pages/liveSound/constants/audioConfig';

// RTZR(VITO) 실시간 STT 연결 설정.
// 마이크 캡처 규격(16kHz mono PCM int16)은 실시간 소리 화면과 동일해서
// liveSound/constants/audioConfig의 값을 그대로 재사용한다.

// 토큰 준비 요청 엔드포인트. dev 서버의 목 백엔드(vite/rtzrMockBackend.ts)가 응답한다.
export const STT_TOKEN_URL = '/api/mock/stt/token';

// VITO 스트리밍 경로. 목 백엔드가 같은 경로로 중계하므로 프론트/서버가 같은 값을 쓴다.
export const STT_STREAM_PATH = '/v1/transcribe:streaming';

// 지금은 dev 서버(같은 오리진)가 중계한다. 실제 백엔드가 생기면 이 값만 바꾸면 된다.
// 예: `wss://api.hearing.example.com`
export const STT_STREAM_ORIGIN = '';

// VITO 스트리밍 쿼리 파라미터.
// - encoding LINEAR16: PCM int16 리틀엔디안. convertFloat32ToInt16의 출력과 같다.
// - use_itn: 숫자/단위를 표기법에 맞게 변환("삼천원" -> "3,000원")
// - use_disfluency_filter: "어", "음" 같은 간투어를 걸러 화면에 덜 지저분하게 남긴다.
export const STT_STREAM_PARAMS = {
  sample_rate: String(TARGET_SAMPLE_RATE),
  encoding: 'LINEAR16',
  model_name: 'sommers_ko',
  use_itn: 'true',
  use_disfluency_filter: 'true',
} as const;

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
} as const;

// 브라우저가 붙을 STT 소켓 주소를 만든다.
// STT_STREAM_ORIGIN이 비어 있으면 현재 페이지와 같은 오리진(dev 프록시)으로 붙는다.
export const buildSttStreamUrl = (): string => {
  const origin =
    STT_STREAM_ORIGIN ||
    `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`;

  const params = new URLSearchParams(STT_STREAM_PARAMS);

  return `${origin}${STT_STREAM_PATH}?${params.toString()}`;
};
