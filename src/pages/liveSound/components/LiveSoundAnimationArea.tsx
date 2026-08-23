import type { SoundRateTypes } from '../types/soundRateTypes';

import LiveSoundAnimation from './LiveSoundAnimation';
import LiveSoundButton from './LiveSoundButton';

interface LiveSoundAnimationAreaPropTypes {
  isListening: boolean;
  isConnecting: boolean;
  statusLabel: string;
  soundRateList: SoundRateTypes[];
  getAmplitude: (() => number) | null;
  onListeningToggleClick: () => void;
}

// 중앙 감지 영역: 동심원 애니메이션 + 상태 라벨 + 시작/중지 버튼을 한 덩어리로 묶는다.
const LiveSoundAnimationArea = ({
  isListening,
  isConnecting,
  statusLabel,
  soundRateList,
  getAmplitude,
  onListeningToggleClick,
}: LiveSoundAnimationAreaPropTypes) => {
  return (
    <div className="flex flex-col items-center">
      <LiveSoundAnimation
        isListening={isListening}
        soundRateList={soundRateList}
        getAmplitude={getAmplitude}
      />
      <h2 className="heading-xl-bold mt-sm text-center text-secondary">
        {statusLabel}
      </h2>
      <LiveSoundButton
        isListening={isListening}
        isConnecting={isConnecting}
        onListeningToggleClick={onListeningToggleClick}
      />
    </div>
  );
};

export default LiveSoundAnimationArea;
