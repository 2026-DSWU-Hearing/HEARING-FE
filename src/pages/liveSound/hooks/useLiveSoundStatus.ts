import { useCallback, useState } from 'react';

import { LIVE_SOUND_STATUS_LABEL } from '../constants/liveSoundStatusLabel';
import type { LiveSoundStatusTypes } from '../types/liveSoundStatusTypes';
import type { LiveSoundClassificationTypes } from '../types/liveSoundSocketTypes';
import type { SoundRateTypes } from '../types/soundRateTypes';
import { mergeLiveSoundSounds } from '../utils/mergeLiveSoundSounds';

import { useLiveSoundSocket } from './useLiveSoundSocket';

interface UseLiveSoundStatusReturnTypes {
  status: LiveSoundStatusTypes;
  isListening: boolean;
  statusLabel: string;
  soundRateList: SoundRateTypes[];
  alertMessage: string;
  // 감지 중일 때만 함수, 아니면 null. 화면은 이 유무로 애니메이션 루프를 켜고 끈다.
  getAmplitude: (() => number) | null;
  handleListeningToggleClick: () => void;
  handleAlertClose: () => void;
}

// 실시간 소리 감지 화면의 상태를 소유하는 훅.
// 결과를 하드웨어(ESP32)용 useDetectionStore에 넣으면 목록이 섞이고 전역 토스트가 중복으로 떠서, 페이지 로컬 상태로 분리했다.
export const useLiveSoundStatus = (): UseLiveSoundStatusReturnTypes => {
  const [soundRateList, setSoundRateList] = useState<SoundRateTypes[]>([]);

  // 스냅샷이라 누적하지 않고 통째로 교체한다. 같은 sound_name 중복은 병합 후 표시한다.
  const handleClassification = useCallback(
    ({ sounds }: LiveSoundClassificationTypes) => {
      setSoundRateList(mergeLiveSoundSounds(sounds));
    },
    [],
  );

  // 첫 메시지가 도착하기 전(connecting 구간) 지난 세션 결과가 남아 보이는 것을 막는다.
  const handleSessionStart = useCallback(() => setSoundRateList([]), []);

  const {
    status,
    alertMessage,
    getAmplitude,
    startSession,
    stopSession,
    clearAlertMessage,
  } = useLiveSoundSocket({
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
    // 감지 중이 아닐 때 null을 주면 화면이 rAF 루프를 아예 돌리지 않는다.
    getAmplitude: isListening ? getAmplitude : null,
    handleListeningToggleClick,
    handleAlertClose: clearAlertMessage,
  };
};
