import { create } from 'zustand';

import type { DetectionTypes } from '@/shared/types/detectionTypes';

// 전역 소켓(useDetectionSocket)이 받은 감지 이벤트를 App(토스트)과 실시간 감지 페이지(목록)가
// 함께 소비하기 위한 스토어. 소켓은 App 전역에 하나뿐이며, 페이지는 별도 소켓을 열지 않는다.

// 최근 감지 목록의 최대 보관 개수(무한 증가 방지).
const MAX_DETECTIONS = 20;

interface DetectionState {
  // 최근 감지 목록(최신순).
  detections: DetectionTypes[];
  // 같은 sound_name은 갱신(상단으로), 상한 초과 시 오래된 것부터 제거.
  pushDetection: (detection: DetectionTypes) => void;
  clearDetections: () => void;
}

export const useDetectionStore = create<DetectionState>((set) => ({
  detections: [],

  pushDetection: (detection) =>
    set((state) => {
      const withoutDuplicate = state.detections.filter(
        ({ sound_name }) => sound_name !== detection.sound_name,
      );
      return {
        detections: [detection, ...withoutDuplicate].slice(0, MAX_DETECTIONS),
      };
    }),

  clearDetections: () => set({ detections: [] }),
}));
