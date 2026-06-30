import { AnimatePresence, motion } from 'motion/react';

import type { ToastItemTypes } from '@/shared/components/toast/ToastContext';
import SoundIconView from '@/shared/components/icons/sounds/SoundIconView';
import CategoryBlock from '@/pages/home/components/sound/CategoryBlock';

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
        {toasts.map(({ id, soundName, categoryName }) => (
          <motion.button
            key={id}
            type="button"
            onClick={() => onClose(id)}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto flex w-full items-center gap-3 rounded-xl bg-neutral-800 px-lg py-base text-left shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)]"
          >
            {/* 소리 아이콘: 소리명으로 SVG/FontAwesome을 자동 매핑. currentColor라 흰색을 따른다. */}
            <SoundIconView
              soundName={soundName}
              categoryName={categoryName}
              className="h-6 w-6 shrink-0 text-white"
            />
            <span className="flex min-w-0 flex-col items-start gap-1">
              <span className="body-base-medium truncate text-white">
                {soundName}
              </span>
              {/* 카테고리 색 배지: 소리 카드와 동일한 CategoryBlock을 재사용해 디자인을 통일.
                  onClick 없이 쓰면 <span>으로 렌더되고 카테고리 고유색(긴급=빨강 등)을 따른다. */}
              <CategoryBlock categoryName={categoryName} />
            </span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastViewport;
