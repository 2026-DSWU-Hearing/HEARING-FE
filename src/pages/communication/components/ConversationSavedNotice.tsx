interface ConversationSavedNoticePropTypes {
  isOpen: boolean;
}

// 대화 종료 시 잠깐 떴다가 자동으로 사라지는 안내. 별도로 누를 버튼이 없고,
// 표시 시간(useCommunicationPage의 타이머)이 지나면 상위에서 isOpen을 false로 내려 닫는다.
const ConversationSavedNotice = ({ isOpen }: ConversationSavedNoticePropTypes) => {
  if (!isOpen) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/50"
    >
      <div className="w-[16.875rem] rounded-xl bg-neutral-800 px-lg py-lg shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)]">
        <p className="body-base-medium whitespace-pre-line text-center text-white">
          대화가 저장되었습니다.
        </p>
      </div>
    </div>
  );
};

export default ConversationSavedNotice;
