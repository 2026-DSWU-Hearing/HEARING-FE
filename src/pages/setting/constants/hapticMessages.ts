// 진동 강도 설정의 저장 동작 기준과 안내 메시지 모음

/**
 * 확정값이 연달아 들어올 때(방향키 연타 등) 마지막 값만 저장하도록 기다리는 시간(ms).
 * 요청을 매번 보내면 응답 순서가 뒤섞여 서버가 마지막이 아닌 값으로 남을 수 있다.
 */
export const HAPTIC_SAVE_DEBOUNCE_MS = 300;

export const HAPTIC_MESSAGE = {
  SAVE_FAILED: '진동 강도 저장에 실패했어요.\n잠시 후 다시 시도해 주세요.',
} as const;
