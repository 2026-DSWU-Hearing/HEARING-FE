import { useId } from 'react';
import { useEscapeKey } from '@/shared/hooks/useEscapeKey';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface AlertModalPropTypes {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const AlertModal = ({ isOpen, message, onClose }: AlertModalPropTypes) => {
  const messageId = useId();

  useEscapeKey(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/50"
      onClick={onClose}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label="알림"
        aria-describedby={messageId}
        className="flex w-[16.875rem] flex-col gap-2 rounded-xl pt-sm pb-lg px-lg bg-neutral-800  shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="self-end leading-none text-tertiary transition-opacity hover:opacity-medium"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <p
          id={messageId}
          className="body-base-medium w-full whitespace-pre-line text-center text-white"
        >
          {message}
        </p>
      </div>
    </div>
  );
};

export default AlertModal;
