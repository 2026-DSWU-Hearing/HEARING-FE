import ConversationEndButton from '@/pages/communication/components/control/ConversationEndButton';
import MicrophoneIcon from '@/shared/components/icons/MicrophoneIcon';

interface RecordingButtonPropTypes {
  isRecording: boolean;
  onToggle: () => void;
  onEndConversation: () => void;
}

// 녹음 버튼과, 녹음 중일 때만 옆에 나타나는 대화 종료 버튼을 한 컴포넌트에서 함께 그린다.
// 예전에는 두 버튼을 페이지에서 따로 렌더링해서, 라벨("말해주세요")이 있을 때/없을 때
// 마이크 버튼 박스의 높이가 달라져 두 버튼의 세로 위치가 어긋나 보였다.
// 라벨을 항상 자리만 차지하게(invisible) 렌더링해서 마이크 버튼 박스 높이를 고정하고,
// 대화 종료 버튼은 그 옆에(양옆으로) 같은 행에서 렌더링해 세로 위치를 맞춘다.
const RecordingButton = ({
  isRecording,
  onToggle,
  onEndConversation,
}: RecordingButtonPropTypes) => {
  return (
    <div className="flex items-center justify-center gap-xl">
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

        <span
          aria-hidden={!isRecording}
          className={`body-base-medium text-center text-primary-500 ${
            isRecording ? '' : 'invisible'
          }`}
        >
          말해주세요!
        </span>
      </div>

      {isRecording && <ConversationEndButton onClick={onEndConversation} />}
    </div>
  );
};

export default RecordingButton;
