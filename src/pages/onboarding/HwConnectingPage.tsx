import { useNavigate } from 'react-router-dom';

import { useConnectingAnimation } from '@/pages/onboarding/hooks/useConnectingAnimation';
import { useDeviceConnectionPolling } from '@/pages/onboarding/hooks/useDeviceConnectionPolling';
import SkipButton from '@/pages/onboarding/components/SkipButton';
import { useOnboardingStore } from '@/pages/onboarding/stores/useOnboardingStore';

const HwConnectingPage = () => {
  const navigate = useNavigate();
  const currentFrame = useConnectingAnimation();

  const resetHardwareConnection = useOnboardingStore(
    (state) => state.resetHardwareConnection,
  );

  // 기기 목록을 주기적으로 조회하다 연결된 기기가 잡히면 완료 페이지가 뜨게끔
  useDeviceConnectionPolling();

  // 실기기가 없거나 연결이 계속 안 잡힐 때 무한 대기에 갇히지 않도록 나가는 길을 열어둔다.
  const handleSkipButtonClick = () => {
    resetHardwareConnection();
    navigate('/');
  };

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

        <SkipButton
          onClick={handleSkipButtonClick}
          className="mt-auto mb-[100px]"
        />
      </section>
    </main>
  );
};

export default HwConnectingPage;