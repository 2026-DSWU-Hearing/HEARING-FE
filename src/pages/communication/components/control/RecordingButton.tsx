interface RecordingButtonPropTypes {
  isRecording: boolean;
  onToggle: () => void;
}

const RecordingButton = ({
  isRecording,
  onToggle,
}: RecordingButtonPropTypes) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`h-14 w-14 rounded-full text-sm font-semibold bg-white border border-gray-200  ${
        isRecording ? 'text-red-500' : 'text-blue-600'
      }`}
    >
      {isRecording ? '중지' : '녹음'}
    </button>
  );
};

export default RecordingButton;
