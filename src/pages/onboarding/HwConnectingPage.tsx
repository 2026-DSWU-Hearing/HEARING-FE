import { useNavigate } from 'react-router-dom';

import { useDeviceConnectionPolling } from '@/pages/onboarding/hooks/useDeviceConnectionPolling';
import SkipButton from '@/pages/onboarding/components/SkipButton';
import { useOnboardingStore } from '@/pages/onboarding/stores/useOnboardingStore';
import LoadingSpinner from '@/shared/components/LoadingSpinner';

const HwConnectingPage = () => {
  const navigate = useNavigate();

  const resetHardwareConnection = useOnboardingStore(
    (state) => state.resetHardwareConnection,
  );

  // 기기 목록을 주기적으로 조회하다 연결된 기기가 잡히면 완료 페이지가 뜨게끔
  useDeviceConnectionPolling();


  const handleSkipButtonClick = () => {
    resetHardwareConnection();
    navigate('/');
  };

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