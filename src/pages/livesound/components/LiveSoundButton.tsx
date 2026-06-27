import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface LiveSoundButtonPropTypes {
  isListening: boolean;
  onListeningToggleClick: () => void;
}

const LiveSoundButton = ({
  isListening,
  onListeningToggleClick,
}: LiveSoundButtonPropTypes) => {
  return (
    <button
      type="button"
      onClick={onListeningToggleClick}
      aria-pressed={isListening}
      className={`mt-base flex h-[2.5rem] items-center justify-center gap-xs rounded-pill border border-neutral-700 px-base py-xs body-base-medium text-secondary transition-all duration-300 active:scale-[0.98] ${
        isListening ? 'bg-[#DF9A00]/20' : 'bg-[#535450]/30'
      }`}
    >
      {isListening ? (
        <FontAwesomeIcon icon={faPause} />
      ) : (
        <FontAwesomeIcon icon={faPlay} />
      )}
      {isListening ? '중지' : '시작'}
    </button>
  );
};

export default LiveSoundButton;
