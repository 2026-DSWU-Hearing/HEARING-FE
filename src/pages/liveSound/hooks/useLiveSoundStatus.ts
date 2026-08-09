import { useCallback, useState } from 'react';

import { LIVE_SOUND_STATUS_LABEL } from '../constants/liveSoundStatusLabel';
import { MAX_SOUND_RATE_COUNT } from '../constants/soundRateDisplay';
import type { LiveSoundStatusTypes } from '../types/liveSoundStatusTypes';
import type { LiveSoundClassificationTypes } from '../types/liveSoundSocketTypes';
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
  name,
  confidence,
}: LiveSoundClassificationTypes): SoundRateTypes => ({
  // 이벤트 id가 아니라 소리 "종류"의 식별자라 중복 판별 키로 쓸 수 있다.
  id: String(sound_id),
  label: name,
  rate: Math.round(confidence * 100),
});

const mergeSoundRate = (
  previousList: SoundRateTypes[],
  incoming: SoundRateTypes,
): SoundRateTypes[] => {
  const [head] = previousList;
  // 같은 값이 다시 오면 배열 참조를 유지해 React가 리렌더를 건너뛰게 한다.
  // 정수 %로 반올림하므로 confidence가 미세하게 흔들려도 갱신되지 않는다.
  if (head?.id === incoming.id && head.rate === incoming.rate)
    return previousList;

  // 같은 소리가 계속 감지되는 게 정상이라 중복은 제거하고 최신 값으로 갱신한다.
  const withoutDuplicate = previousList.filter(({ id }) => id !== incoming.id);

  return [incoming, ...withoutDuplicate].slice(0, MAX_SOUND_RATE_COUNT);
};

// 실시간 소리 감지 화면의 상태를 소유하는 훅.
// 결과를 하드웨어(ESP32)용 useDetectionStore에 넣으면 목록이 섞이고 전역 토스트가 중복으로 떠서,
// 페이지 로컬 상태로 분리했다.
export const useLiveSoundStatus = (): UseLiveSoundStatusReturnTypes => {
  const [soundRateList, setSoundRateList] = useState<SoundRateTypes[]>([]);

  const handleClassification = useCallback(
    (classification: LiveSoundClassificationTypes) => {
      setSoundRateList((previousList) =>
        mergeSoundRate(previousList, toSoundRate(classification)),
      );
    },
    [],
  );

  // 중지 시엔 SoundRateBlock이 카드를 숨기므로 시작할 때만 비우면 된다.
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
