import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { getDevices } from '@/pages/onboarding/apis/deviceApi';
import { useOnboardingStore } from '@/pages/onboarding/stores/useOnboardingStore';
import ing1Icon from '@/shared/assets/icons/onboarding/ing1.svg';
import ing2Icon from '@/shared/assets/icons/onboarding/ing2.svg';
import ing3Icon from '@/shared/assets/icons/onboarding/ing3.svg';

const CONNECTING_FRAME_DELAY_MS = 500;
const DEVICE_POLLING_INTERVAL_MS = 1000;

const CONNECTING_FRAMES = [
  {
    iconSrc: ing1Icon,
    iconClassName: 'h-[104px] w-[104px]',
    text: '연결 중 .',
  },
  {
    iconSrc: ing2Icon,
    iconClassName: 'h-[146px] w-[146px]',
    text: '연결 중 ..',
  },
  {
    iconSrc: ing3Icon,
    iconClassName: 'h-[198px] w-[198px]',
    text: '연결 중 ...',
  },
  {
    iconSrc: ing2Icon,
    iconClassName: 'h-[146px] w-[146px]',
    text: '연결 중 ..',
  },
];

const HwConnectingPage = () => {
  const navigate = useNavigate();
  const [frameIndex, setFrameIndex] = useState(0);

  const setHardwareConnected = useOnboardingStore(
    (state) => state.setHardwareConnected,
  );

  const setConnectedDevice = useOnboardingStore(
    (state) => state.setConnectedDevice,
  );

  const { data: devices } = useQuery({
    queryKey: ['devices'],
    queryFn: getDevices,
    refetchInterval: DEVICE_POLLING_INTERVAL_MS,
    refetchOnWindowFocus: false,
  });

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

  useEffect(() => {
    const connectedDevice = devices?.find((device) => device.is_connected);

    if (!connectedDevice) {
      return;
    }

    setConnectedDevice(connectedDevice);
    setHardwareConnected(true);
    navigate('/onboarding/hardware/complete');
  }, [devices, navigate, setConnectedDevice, setHardwareConnected]);

  const currentFrame = CONNECTING_FRAMES[frameIndex];

  return (
    <main className="flex min-h-dvh w-full justify-center bg-neutral-950 text-primary">
      <section className="flex min-h-dvh w-full flex-col items-center bg-neutral-950 pt-[261px]">
        <div className="flex flex-col items-center gap-[89px]">
          <div className="flex h-[198px] w-[198px] items-center justify-center">
            <img
              src={currentFrame.iconSrc}
              alt=""
              aria-hidden="true"
              className={`${currentFrame.iconClassName} shrink-0 object-contain`}
            />
          </div>

          <p className="heading-lg-semibold text-center text-primary-400">
            {currentFrame.text}
          </p>
        </div>
      </section>
    </main>
  );
};

export default HwConnectingPage;
