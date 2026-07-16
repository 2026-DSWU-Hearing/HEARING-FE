import { useNavigate } from 'react-router-dom';

import { useDeviceConnectionPolling } from '@/pages/onboarding/hooks/useDeviceConnectionPolling';
import LongConfirmButton from '@/pages/onboarding/components/LongConfirmButton';
import OnboardingLayout from '@/pages/onboarding/components/OnboardingLayout';
import OnboardingTopNavigation from '@/pages/onboarding/components/OnboardingTopNavigation';
import SkipButton from '@/pages/onboarding/components/SkipButton';
import { useOnboardingStore } from '@/pages/onboarding/stores/useOnboardingStore';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import { DEVICE_MESSAGE } from '@/shared/constants/deviceMessages';
import { useDeviceConnectionWait } from '@/shared/hooks/useDeviceConnectionWait';

const HwConnectingPage = () => {
  const navigate = useNavigate();

  const resetHardwareConnection = useOnboardingStore(
    (state) => state.resetHardwareConnection,
  );

  // 기기 목록을 주기적으로 조회하다 연결된 기기가 잡히면 완료 페이지가 뜨게끔
  const { isConnected } = useDeviceConnectionPolling();

  // 이 페이지에 왔다는 것은 앞 화면에서 기기 등록에 성공했다는 뜻이므로 바로 대기를 시작한다.
  const { isTimedOutWaiting, retryWaiting } = useDeviceConnectionWait(
    isConnected,
    true,
  );

  const handleSkipButtonClick = () => {
    resetHardwareConnection();
    navigate('/');
  };

  // 대기 시간을 초과하면 무한 스피너 대신 이유와 선택지를 준다.
  if (isTimedOutWaiting) {
    return (
      <OnboardingLayout
        title={'기기를\n찾지 못했습니다'}
        topNavigation={
          <OnboardingTopNavigation
            onBackClick={() => navigate('/onboarding/hardware')}
          />
        }
        bottomButton={
          <div className="flex w-full flex-col items-center gap-xs">
            <LongConfirmButton onClick={retryWaiting}>
              다시 찾기
            </LongConfirmButton>
            <SkipButton onClick={handleSkipButtonClick} />
          </div>
        }
      >
        <p
          role="alert"
          className="mt-[72px] whitespace-pre-line text-center body-lg-regular text-secondary"
        >
          {DEVICE_MESSAGE.CONNECT_FAILED_HINT}
        </p>
      </OnboardingLayout>
    );
  }

  return (
    <main className="relative min-h-dvh w-full bg-neutral-950 text-primary">
      <div className="absolute inset-0">
        <LoadingSpinner />
      </div>

      <SkipButton
        onClick={handleSkipButtonClick}
        className="absolute bottom-[100px] left-1/2 -translate-x-1/2"
      />
    </main>
  );
};

export default HwConnectingPage;
