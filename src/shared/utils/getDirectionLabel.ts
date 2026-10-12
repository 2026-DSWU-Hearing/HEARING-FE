import { DETECTION_DIRECTION_LABEL } from '@/shared/constants/detectionDirection';
import type { DetectionDirectionTypes } from '@/shared/types/detectionTypes';

/**
 * 감지 방향을 화면 문구로 바꾼다.
 * UNKNOWN이거나 표에 없는 값(서버가 나중에 값을 늘린 경우)이면 null을 돌려주고,
 * 호출부는 null일 때 방향을 아예 그리지 않는다.
 */
export const getDirectionLabel = (
  direction: DetectionDirectionTypes,
): string | null => DETECTION_DIRECTION_LABEL[direction] ?? null;
