// 백엔드 STT 소켓(WS /ws/conversations/{id}/stt)이 내려주는 메시지 타입.
// RTZR 원본 응답은 서버가 가공해서 아래 형태로만 내려준다.

export interface SttResultMessageTypes {
  content: string;
  // false면 인식 중인 중간 결과, true면 확정된 문장.
  isFinal: boolean;
}

// 'idle'      : 마이크를 열지 않은 상태
// 'connecting': 토큰 확인 + 소켓 연결 중
// 'listening' : 오디오를 흘려보내는 중
// 'error'     : 마이크/소켓 실패
export type SttStatusTypes = 'idle' | 'connecting' | 'listening' | 'error';
