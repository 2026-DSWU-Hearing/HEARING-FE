import LiveSoundAnimation from './LiveSoundAnimation';
import LiveSoundButton from './LiveSoundButton';

interface LiveSoundAnimationAreaPropTypes {
  isListening: boolean;
  statusLabel: string;
  onListeningToggleClick: () => void;
}

// 중앙 감지 영역: 동심원 애니메이션 + 상태 라벨 + 시작/중지 버튼을 한 덩어리로 묶는다.
const LiveSoundAnimationArea = ({
  isListening,
  statusLabel,
  onListeningToggleClick,
}: LiveSoundAnimationAreaPropTypes) => {
  return (
    <div className="flex flex-col items-center">
      <LiveSoundAnimation isListening={isListening} />
      <h2 className="heading-xl-bold mt-sm text-center text-secondary">
        {statusLabel}
      </h2>
      <LiveSoundButton
        isListening={isListening}
        onListeningToggleClick={onListeningToggleClick}
      />
    </div>
  );
};

export default LiveSoundAnimationArea;
