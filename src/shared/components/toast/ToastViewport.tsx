import { AnimatePresence, motion } from 'motion/react';

import type { ToastItemTypes } from '@/shared/components/toast/ToastContext';

interface ToastViewportPropTypes {
  toasts: ToastItemTypes[];
  onClose: (id: number) => void;
}

// 토스트 큐를 화면 상단에 쌓아 렌더링한다.
// 앱 컨테이너 폭(max-w-[430px])에 맞춰 중앙 정렬해 데스크톱에서도 모바일 폭 안에 머문다.
const ToastViewport = ({ toasts, onClose }: ToastViewportPropTypes) => {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 mx-auto flex w-full max-w-[430px] flex-col items-center gap-2 px-lg pt-4">
      <AnimatePresence>
        {toasts.map(({ id, message }) => (
          <motion.button
            key={id}
            type="button"
            onClick={() => onClose(id)}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="body-base-medium pointer-events-auto w-full whitespace-pre-line rounded-xl bg-neutral-800 px-lg py-base text-center text-white shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)]"
          >
            {message}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastViewport;
