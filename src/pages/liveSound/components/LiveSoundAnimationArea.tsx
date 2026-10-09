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
    // w-full이 반드시 필요하다. 부모 section이 items-center라 이 래퍼는 기본적으로
    // 자식 콘텐츠 폭(fit-content)으로 잡히는데, 그러면 LiveSoundAnimation의
    // maxWidth: 100%가 "부모가 자식에 의존하는 순환 %"가 돼 무시되고(CSS Sizing의
    // cyclic percentage 규칙), 고정 width 21.75rem이 그대로 살아 320px 화면에서
    // 링이 좌우로 넘쳐 잘린다. 래퍼가 section 폭을 stretch로 받아야 100%가 풀린다.
    <div className="flex w-full flex-col items-center">
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
