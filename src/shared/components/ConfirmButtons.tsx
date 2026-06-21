interface ConfirmButtonsPropTypes {
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  hideCancel?: boolean;
  /** 확인 버튼 비활성화 여부 (유효성 검증 실패 시 등) */
  confirmDisabled?: boolean;
}

const ConfirmButtons = ({
  onConfirm,
  onCancel,
  confirmText = '확인',
  cancelText = '취소',
  hideCancel = false,
  confirmDisabled = false,
}: ConfirmButtonsPropTypes) => {
  return (
    <div className="flex w-full items-center justify-center gap-4">
      {!hideCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="heading-base-semibold flex flex-1 items-center justify-center rounded-pill bg-neutral-600/20 py-2 text-center font-semibold text-white transition-colors hover:bg-neutral-600/35"
        >
          {cancelText}
        </button>
      )}
      <button
        type="button"
        onClick={onConfirm}
        disabled={confirmDisabled}
        className="heading-base-semibold flex flex-1 items-center justify-center rounded-pill bg-primary-400 py-2 text-center font-semibold text-neutral-800 transition-colors hover:bg-primary-500 disabled:cursor-not-allowed disabled:bg-neutral-600 disabled:text-neutral-400 disabled:hover:bg-neutral-600"
      >
        {confirmText}
      </button>
    </div>
  );
};

export default ConfirmButtons;
