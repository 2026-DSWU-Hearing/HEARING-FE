import { useEffect, useRef, useState } from 'react';

export const useThrottleValue = <ValueTypes,>(
  value: ValueTypes,
  delay = 300,
) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdatedTimeRef = useRef(0);
  const timeoutIdRef = useRef<number | null>(null);

  useEffect(() => {
    const now = Date.now();
    const remainingDelay = delay - (now - lastUpdatedTimeRef.current);

    if (remainingDelay <= 0) {
      if (timeoutIdRef.current !== null) {
        window.clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }

      setThrottledValue(value);
      lastUpdatedTimeRef.current = now;
      return;
    }

    if (timeoutIdRef.current !== null) {
      window.clearTimeout(timeoutIdRef.current);
    }

    timeoutIdRef.current = window.setTimeout(() => {
      setThrottledValue(value);
      lastUpdatedTimeRef.current = Date.now();
      timeoutIdRef.current = null;
    }, remainingDelay);

    return () => {
      if (timeoutIdRef.current !== null) {
        window.clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
    };
  }, [delay, value]);

  return throttledValue;
};
