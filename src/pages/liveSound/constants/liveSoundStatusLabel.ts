import type { LiveSoundStatusTypes } from '../types/liveSoundStatusTypes';

// 상태별 화면 라벨. Record로 묶어 유니온에 키가 추가되면 컴파일러가 누락을 잡아준다.
export const LIVE_SOUND_STATUS_LABEL: Record<LiveSoundStatusTypes, string> = {
  idle: '감지 전',
  connecting: '연결 중...',
  listening: '감지 중...',
  // 연결 실패뿐 아니라 마이크 권한 거부·장치 없음·미지원도 이 상태로 온다.
  error: '감지 시작 실패',
};
