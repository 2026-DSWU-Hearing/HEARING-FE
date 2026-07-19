import { useEffect, useRef, useState } from 'react';

// 애니메이션 재생 시간(ms). theme.css의 animate-bubble-rise 지속시간(0.35s)과 맞춰둔다.
const RISE_ANIMATION_DURATION_MS = 350;

// trigger가 false → true로 바뀌는 순간에만 애니메이션을 한 번 재생한다(계속 true여도 반복 재생 안 함).
// 채팅 버블에서 "상대편이 입력을 시작하는 순간" 반대쪽 버블을 그 입력 영역 쪽에서
// 올라오듯 보여주는 데 쓴다. getRiseDistance를 넘기면 트리거되는 그 순간에 실제 두 영역
// 사이의 거리를 재서 시작 위치(translateY)로 사용하고, 없으면 CSS 기본값을 쓴다.
export const useRiseAnimation = (
  trigger: boolean,
  getRiseDistance?: () => number,
) => {
  const [isRising, setIsRising] = useState(false);
  const [riseDistance, setRiseDistance] = useState(0);
  const prevTriggerRef = useRef(trigger);
  const getRiseDistanceRef = useRef(getRiseDistance);
  getRiseDistanceRef.current = getRiseDistance;

  useEffect(() => {
    const justStartedTyping = trigger && !prevTriggerRef.current;
    prevTriggerRef.current = trigger;

    if (!justStartedTyping) return;

    setRiseDistance(getRiseDistanceRef.current?.() ?? 0);
    setIsRising(true);
    const timer = setTimeout(
      () => setIsRising(false),
      RISE_ANIMATION_DURATION_MS,
    );

    return () => clearTimeout(timer);
  }, [trigger]);

  return { isRising, riseDistance };
};
