import CloseIcon from '@/shared/components/icons/CloseIcon';

interface ConversationEndButtonPropTypes {
  onClick: () => void;
}

// 녹음 중일 때만 마이크 버튼 옆에 나타나는 대화 종료 버튼.
const ConversationEndButton = ({ onClick }: ConversationEndButtonPropTypes) => {
  return (
    <div className="flex flex-col items-center gap-xs">
      <button
        type="button"
        onClick={onClick}
        aria-label="대화 종료"
        className="flex h-[4rem] w-[4rem] items-center justify-center rounded-pill card-false p-sm text-state-alert transition-all active:scale-[0.98]"
      >
        <CloseIcon className="h-icon-2xl w-icon-2xl" />
      </button>
      <span className="body-base-medium text-center text-state-alert">
        대화 종료
      </span>
    </div>
  );
};

export default ConversationEndButton;
