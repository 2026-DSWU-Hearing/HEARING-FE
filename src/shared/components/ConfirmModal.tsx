import { useId } from 'react';
import ConfirmButtons from '@/shared/components/ConfirmButtons';
import { useEscapeKey } from '@/shared/hooks/useEscapeKey';

interface ConfirmModalPropTypes {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
  hideCancel?: boolean;
}

const ConfirmModal = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
  onClose,
  confirmText,
  cancelText,
  hideCancel,
}: ConfirmModalPropTypes) => {
  const messageId = useId();

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    onCancel();
    onClose();
  };

  useEscapeKey(isOpen, handleCancel);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={handleCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="확인"
        aria-describedby={messageId}
        className="flex w-[17rem] flex-col items-center justify-center gap-4 rounded-2xl bg-neutral-800 p-lg shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)]"
        onClick={(event) => event.stopPropagation()}
      >
        <p
          id={messageId}
          className="mb-base body-base-medium w-full whitespace-pre-line text-center text-white"
        >
          {message}
        </p>
        <ConfirmButtons
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          confirmText={confirmText}
          cancelText={cancelText}
          hideCancel={hideCancel}
        />
      </div>
    </div>
  );
};

export default ConfirmModal;
