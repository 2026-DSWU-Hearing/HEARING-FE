import { useState } from 'react';

import { useDetectionStore } from '@/shared/stores/useDetectionStore';
import type { DetectionTypes } from '@/shared/types/detectionTypes';

import { LIVE_SOUND_STATUS_LABEL } from '../constants/liveSoundStatusLabel';
import type { LiveSoundStatusTypes } from '../types/liveSoundStatusTypes';
import type { SoundRateTypes } from '../types/soundRateTypes';

interface UseLiveSoundStatusReturnTypes {
  status: LiveSoundStatusTypes;
  isListening: boolean;
  statusLabel: string;
  soundRateList: SoundRateTypes[];
  handleListeningToggleClick: () => void;
}

// 감지 이벤트(confidence 0~1)를 화면용 비율 리스트(rate %)로 매핑.
const toSoundRate = ({
  id,
  sound_name,
  confidence,
}: DetectionTypes): SoundRateTypes => ({
  id: String(id),
  label: sound_name,
  rate: Math.round(confidence * 100),
});

// 전역 스토어(useDetectionStore)에 쌓인 감지를 구독해 화면용 데이터로 변환하는 훅.
// isListening을 구독 게이트로 써, 감지 중일 때만 목록을 노출한다.
export const useLiveSoundStatus = (): UseLiveSoundStatusReturnTypes => {
  const [status, setStatus] = useState<LiveSoundStatusTypes>('idle');
  const detections = useDetectionStore((state) => state.detections);
  const clearDetections = useDetectionStore((state) => state.clearDetections);

  const isListening = status === 'listening';

  const handleListeningToggleClick = () => {
    const nextStatus = isListening ? 'idle' : 'listening';
    setStatus(nextStatus);
    // 토글마다 목록 초기화(시작=이전 감지 지우고 새로 시작, 중지=다음 세션에 남기지 않음).
    clearDetections();
    // TODO(오디오 업로드 API 연동): 시작 시 getUserMedia로 마이크 캡처→서버 전송, 중지 시 중단.
  };

  return {
    status,
    isListening,
    statusLabel: LIVE_SOUND_STATUS_LABEL[status],
    soundRateList: isListening ? detections.map(toSoundRate) : [],
    handleListeningToggleClick,
  };
};
