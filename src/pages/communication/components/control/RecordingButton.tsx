import MicrophoneIcon from '@/shared/components/icons/MicrophoneIcon';

interface RecordingButtonPropTypes {
  isRecording: boolean;
  onToggle: () => void;
}

const RecordingButton = ({ isRecording, onToggle }: RecordingButtonPropTypes) => {
  return (
    <div className="flex flex-col items-center gap-xs">
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={isRecording}
        aria-label={isRecording ? '녹음 중' : '녹음 시작'}
        className={`flex h-[4rem] w-[4rem] items-center justify-center rounded-pill p-sm transition-all active:scale-[0.98] ${
          isRecording
            ? 'shadow-[0_0_30px_0_rgba(255,253,240,0.80)] bg-neutral-50 text-primary-500'
            : 'card-false text-primary'
        }`}
      >
        <MicrophoneIcon className="h-icon-2xl w-icon-2xl" />
      </button>

      {isRecording && (
        <span className="body-base-medium text-center text-primary-500">
          말해주세요
        </span>
      )}
    </div>
  );
};

export default RecordingButton;
