import { useConnectingAnimation } from '@/pages/onboarding/hooks/useConnectingAnimation';
import { useDeviceConnectionPolling } from '@/pages/onboarding/hooks/useDeviceConnectionPolling';

const HwConnectingPage = () => {
  const currentFrame = useConnectingAnimation();

  useDeviceConnectionPolling();

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
