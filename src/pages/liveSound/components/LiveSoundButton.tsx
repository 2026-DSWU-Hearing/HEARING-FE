import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface LiveSoundButtonPropTypes {
  isListening: boolean;
  isConnecting: boolean;
  onListeningToggleClick: () => void;
}

const LiveSoundButton = ({
  isListening,
  isConnecting,
  onListeningToggleClick,
}: LiveSoundButtonPropTypes) => {
  // 연결 중에도 다시 누르면 취소되므로 중지 UI를 보여준다.
  const isStoppable = isListening || isConnecting;

  return (
    <button
      type="button"
      onClick={onListeningToggleClick}
      aria-pressed={isStoppable}
      className={`mt-base flex h-[2.5rem] items-center justify-center gap-xs rounded-pill border border-neutral-700 px-base py-xs body-base-medium text-secondary transition-all duration-300 active:scale-[0.98] ${
        isStoppable ? 'bg-[#DF9A00]/20' : 'bg-[#535450]/30'
      }`}
    >
      {isStoppable ? (
        <FontAwesomeIcon icon={faPause} />
      ) : (
        <FontAwesomeIcon icon={faPlay} />
      )}
      {isStoppable ? '중지' : '시작'}
    </button>
  );
};

export default LiveSoundButton;
