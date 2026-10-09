import { useEffect, useRef } from 'react';

export const useEscapeKey = (isActive: boolean, onEscape: () => void) => {
  const onEscapeRef = useRef(onEscape);

  // 최신 onEscape 콜백을 ref에 동기화 (리스너 재등록 없이 항상 최신 참조 사용)
  useEffect(() => {
    onEscapeRef.current = onEscape;
  }, [onEscape]);

  // 리스너 등록은 isActive 변경 시에만 실행
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onEscapeRef.current();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);
};
