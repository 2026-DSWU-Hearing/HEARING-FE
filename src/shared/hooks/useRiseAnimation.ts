import { useEffect, useRef, useState } from 'react';

// 애니메이션 재생 시간(ms). theme.css의 animate-bubble-rise 지속시간(0.35s)과 맞춰둔다.
const RISE_ANIMATION_DURATION_MS = 350;

// trigger가 false → true로 바뀌는 순간에만 true를 잠깐 반환한다(한 번만 재생, 계속 true여도 반복 재생 안 함).
// 채팅 버블에서 "상대편이 입력을 시작하는 순간" 반대쪽 버블을 아래에서 올라오듯 보여주는 데 쓴다.
export const useRiseAnimation = (trigger: boolean) => {
  const [isRising, setIsRising] = useState(false);
  const prevTriggerRef = useRef(trigger);

  useEffect(() => {
    const justStartedTyping = trigger && !prevTriggerRef.current;
    prevTriggerRef.current = trigger;

    if (!justStartedTyping) return;

    setIsRising(true);
    const timer = setTimeout(
      () => setIsRising(false),
      RISE_ANIMATION_DURATION_MS,
    );

    return () => clearTimeout(timer);
  }, [trigger]);

  return isRising;
};
