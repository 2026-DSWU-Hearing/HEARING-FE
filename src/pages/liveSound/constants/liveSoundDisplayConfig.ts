// 화면 표시 규칙. 오디오 처리와 무관하게 "무엇을 어떻게 보여줄지"만 담는다.

// 새 소리가 현재 1순위보다 이만큼(confidence 차이) 높아야 교체 후보가 된다.
// 78%↔74%처럼 엎치락뒤치락하는 값으로 중앙 아이콘이 바뀌는 것을 막는다.
export const PRIMARY_SOUND_SWITCH_MARGIN = 0.1;

// 후보 상태가 연속 몇 번 유지돼야 실제로 교체하는가.
// 서버 스냅샷이 1초 주기라 2 = 약 2초간 확실히 더 컸을 때만 바뀐다는 뜻이다.
export const PRIMARY_SOUND_SWITCH_STREAK = 2;

// 하단 목록에 표시할 최소 confidence(0~1). 이 미만은 아예 빼고,
// 항목이 3개가 안 되더라도 억지로 채우지 않는다.
export const SOUND_RATE_DISPLAY_THRESHOLD = 0.15;

// 중앙 아이콘이 바뀔 때의 페이드 시간(초).
export const PRIMARY_SOUND_FADE_DURATION_SECOND = 0.35;
