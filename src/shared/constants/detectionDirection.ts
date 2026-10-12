import type { DetectionDirectionTypes } from '@/shared/types/detectionTypes';

// 감지 방향의 화면 표시 문구. UNKNOWN은 표시하지 않으므로 항목을 두지 않는다.
// public/firebase-messaging-sw.js에도 같은 표가 있다(서비스워커는 번들 밖이라 import 불가).
// 문구를 바꾸면 양쪽을 함께 고친다.
export const DETECTION_DIRECTION_LABEL: Partial<
  Record<DetectionDirectionTypes, string>
> = {
  FRONT: '앞',
  BACK: '뒤',
  LEFT: '왼쪽',
  RIGHT: '오른쪽',
};
