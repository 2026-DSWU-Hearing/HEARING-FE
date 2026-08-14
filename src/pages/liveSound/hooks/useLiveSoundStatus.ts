import { useCallback, useState } from 'react';

import { LIVE_SOUND_STATUS_LABEL } from '../constants/liveSoundStatusLabel';
import type { LiveSoundStatusTypes } from '../types/liveSoundStatusTypes';
import type {
  LiveSoundClassificationTypes,
  LiveSoundSoundItemTypes,
} from '../types/liveSoundSocketTypes';
import type { SoundRateTypes } from '../types/soundRateTypes';

import { useLiveSoundSocket } from './useLiveSoundSocket';

interface UseLiveSoundStatusReturnTypes {
  status: LiveSoundStatusTypes;
  isListening: boolean;
  statusLabel: string;
  soundRateList: SoundRateTypes[];
  alertMessage: string;
  handleListeningToggleClick: () => void;
  handleAlertClose: () => void;
}

// 분류 결과(confidence 0~1)를 화면용 비율(rate %)로 매핑.
const toSoundRate = ({
  sound_id,
  sound_name,
  confidence,
}: LiveSoundSoundItemTypes): SoundRateTypes => ({
  id: String(sound_id),
  label: sound_name,
  rate: Math.round(confidence * 100),
});

// 실시간 소리 감지 화면의 상태를 소유하는 훅.
// 결과를 하드웨어(ESP32)용 useDetectionStore에 넣으면 목록이 섞이고 전역 토스트가 중복으로 떠서, 페이지 로컬 상태로 분리했다.
export const useLiveSoundStatus = (): UseLiveSoundStatusReturnTypes => {
  const [soundRateList, setSoundRateList] = useState<SoundRateTypes[]>([]);

  // 스냅샷이라 누적하지 않고 통째로 교체한다. 표시 개수와 순서는 서버를 그대로 따른다.
  const handleClassification = useCallback(
    ({ sounds }: LiveSoundClassificationTypes) => {
      setSoundRateList(sounds.map(toSoundRate));
    },
    [],
  );

  // 첫 메시지가 도착하기 전(connecting 구간) 지난 세션 결과가 남아 보이는 것을 막는다.
  const handleSessionStart = useCallback(() => setSoundRateList([]), []);

  const { status, alertMessage, startSession, stopSession, clearAlertMessage } =
    useLiveSoundSocket({
      onClassification: handleClassification,
      onSessionStart: handleSessionStart,
    });

  const isListening = status === 'listening';

  const handleListeningToggleClick = () => {
    // connecting 중 다시 누르면 진행 중인 연결을 취소한다.
    if (isListening || status === 'connecting') {
      stopSession();
      return;
    }

    startSession();
  };

  return {
    status,
    isListening,
    statusLabel: LIVE_SOUND_STATUS_LABEL[status],
    soundRateList,
    alertMessage,
    handleListeningToggleClick,
    handleAlertClose: clearAlertMessage,
  };
};
