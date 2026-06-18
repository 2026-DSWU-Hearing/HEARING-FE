interface ConfirmButtonsPropTypes {
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  hideCancel?: boolean;
}

const ConfirmButtons = ({
  onConfirm,
  onCancel,
  confirmText = '확인',
  cancelText = '취소',
  hideCancel = false,
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
        className="heading-base-semibold flex flex-1 items-center justify-center rounded-pill bg-primary-400 py-2 text-center font-semibold text-neutral-800 transition-colors hover:bg-primary-500"
      >
        {confirmText}
      </button>
    </div>
  );
};

export default ConfirmButtons;
