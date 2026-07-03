import { useEffect, useState } from 'react';

import {
  CONNECTING_FRAME_DELAY_MS,
  CONNECTING_FRAMES,
} from '@/pages/onboarding/constants/hardwareConstants';

export const useConnectingAnimation = () => {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setFrameIndex((prevFrameIndex) =>
        prevFrameIndex === CONNECTING_FRAMES.length - 1
          ? 0
          : prevFrameIndex + 1,
      );
    }, CONNECTING_FRAME_DELAY_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return CONNECTING_FRAMES[frameIndex];
};
