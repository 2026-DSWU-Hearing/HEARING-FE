import { useCallback, useEffect, useRef, useState } from 'react';
import type { MouseEvent, PointerEvent } from 'react';

const DRAG_START_THRESHOLD = 4;

interface DragStateTypes {
  pointerId: number | null;
  startClientX: number;
  startScrollLeft: number;
  hasDragged: boolean;
}

const INITIAL_DRAG_STATE: DragStateTypes = {
  pointerId: null,
  startClientX: 0,
  startScrollLeft: 0,
  hasDragged: false,
};

// 가로 스크롤 영역을 마우스로 잡아 끌 수 있게 하고,
// 실제 드래그 뒤에 발생하는 클릭은 차단해 내부 버튼의 오작동을 막는다.
export const useHorizontalDragScroll = () => {
  const dragStateRef = useRef<DragStateTypes>(INITIAL_DRAG_STATE);
  const clickSuppressionTimeoutRef = useRef<number | null>(null);
  const shouldPreventClickRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const clearClickSuppressionTimeout = useCallback(() => {
    if (clickSuppressionTimeoutRef.current === null) return;

    window.clearTimeout(clickSuppressionTimeoutRef.current);
    clickSuppressionTimeoutRef.current = null;
  }, []);

  useEffect(
    () => () => {
      clearClickSuppressionTimeout();
    },
    [clearClickSuppressionTimeout],
  );

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;

      clearClickSuppressionTimeout();
      shouldPreventClickRef.current = false;
      dragStateRef.current = {
        pointerId: event.pointerId,
        startClientX: event.clientX,
        startScrollLeft: event.currentTarget.scrollLeft,
        hasDragged: false,
      };
    },
    [clearClickSuppressionTimeout],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const dragState = dragStateRef.current;
      if (dragState.pointerId !== event.pointerId) return;

      const dragDistance = event.clientX - dragState.startClientX;
      if (
        !dragState.hasDragged &&
        Math.abs(dragDistance) < DRAG_START_THRESHOLD
      ) {
        return;
      }

      if (!dragState.hasDragged) {
        dragState.hasDragged = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        setIsDragging(true);
      }

      event.preventDefault();
      event.currentTarget.scrollLeft = dragState.startScrollLeft - dragDistance;
    },
    [],
  );

  const finishDragging = useCallback(
    (event: PointerEvent<HTMLDivElement>, shouldSuppressClick: boolean) => {
      const dragState = dragStateRef.current;
      if (dragState.pointerId !== event.pointerId) return;

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      shouldPreventClickRef.current =
        shouldSuppressClick && dragState.hasDragged;
      dragStateRef.current = INITIAL_DRAG_STATE;
      setIsDragging(false);

      if (shouldPreventClickRef.current) {
        clearClickSuppressionTimeout();
        clickSuppressionTimeoutRef.current = window.setTimeout(() => {
          shouldPreventClickRef.current = false;
          clickSuppressionTimeoutRef.current = null;
        }, 0);
      }
    },
    [clearClickSuppressionTimeout],
  );

  const handlePointerUp = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      finishDragging(event, true);
    },
    [finishDragging],
  );

  const handlePointerCancel = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      finishDragging(event, false);
    },
    [finishDragging],
  );

  const handleClickCapture = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (!shouldPreventClickRef.current) return;

      event.preventDefault();
      event.stopPropagation();
      shouldPreventClickRef.current = false;
      clearClickSuppressionTimeout();
    },
    [clearClickSuppressionTimeout],
  );

  return {
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handleClickCapture,
  };
};
