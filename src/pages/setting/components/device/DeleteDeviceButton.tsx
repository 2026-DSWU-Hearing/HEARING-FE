interface DeleteDeviceButtonPropTypes {
  onClick: () => void;
}

/**
 * 기기 연결 해제 버튼.
 * 자주 누를 액션이 아니므로 강조하지 않고, 눌리는 회색 텍스트로만 표시한다.
 * 접근성을 위해 모양은 텍스트여도 button 요소를 유지한다.
 */
const DeleteDeviceButton = ({ onClick }: DeleteDeviceButtonPropTypes) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="self-end heading-base-semibold text-disabled"
    >
      기기 연결 해제
    </button>
  );
};

export default DeleteDeviceButton;
