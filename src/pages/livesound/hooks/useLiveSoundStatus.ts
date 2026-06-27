import { useState } from 'react';

import { LIVE_SOUND_RATE_LIST } from '../constants/liveSoundRateList';
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

// 실시간 소리 감지의 상태와 데이터를 모두 캡슐화하는 훅.
// 현재는 상태를 토글하고 목업 상수를 반환하지만, 추후 이 훅 내부에서 WebSocket을 열어
// 'connecting' → 'listening' 전환과 수신 메시지(soundRateList) 처리를 담으면
// 페이지·컴포넌트 코드는 그대로 둘 수 있다.
export const useLiveSoundStatus = (): UseLiveSoundStatusReturnTypes => {
  const [status, setStatus] = useState<LiveSoundStatusTypes>('idle');

  const isListening = status === 'listening';

  const handleListeningToggleClick = () => {
    setStatus((currentStatus) =>
      currentStatus === 'listening' ? 'idle' : 'listening',
    );
  };

  return {
    status,
    isListening,
    statusLabel: LIVE_SOUND_STATUS_LABEL[status],
    soundRateList: isListening ? LIVE_SOUND_RATE_LIST : [],
    handleListeningToggleClick,
  };
};
