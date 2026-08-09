import type { LiveSoundStatusTypes } from '../types/liveSoundStatusTypes';

// 상태별 화면 라벨. Record로 묶어 유니온에 키가 추가되면 컴파일러가 누락을 잡아준다.
export const LIVE_SOUND_STATUS_LABEL: Record<LiveSoundStatusTypes, string> = {
  idle: '감지 전',
  connecting: '연결 중...',
  listening: '감지 중...',
  error: '연결 실패',
};
