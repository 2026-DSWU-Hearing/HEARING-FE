// RTZR(VITO) 실시간 STT 소켓이 내려주는 메시지 타입.
// 서버가 주는 원본 키가 snake_case라 그대로 둔다(변환 지점은 useSttSocket 한 곳).

export interface SttWordTypes {
  text: string;
  start_at: number;
  duration: number;
  confidence: number;
}

export interface SttAlternativeTypes {
  text: string;
  confidence?: number;
  // final이 true일 때만 내려온다.
  words?: SttWordTypes[];
}

export interface SttResultMessageTypes {
  seq: number;
  start_at: number;
  duration: number;
  // false면 인식 중인 중간 결과, true면 확정된 문장.
  final: boolean;
  alternatives: SttAlternativeTypes[];
}

// 'idle'      : 마이크를 열지 않은 상태
// 'connecting': 토큰 확인 + 소켓 연결 중
// 'listening' : 오디오를 흘려보내는 중
// 'error'     : 마이크/소켓 실패
export type SttStatusTypes = 'idle' | 'connecting' | 'listening' | 'error';
