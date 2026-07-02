import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import OnboardingLayout from '@/pages/onboarding/components/OnboardingLayout';
import { useOnboardingStore } from '@/pages/onboarding/stores/useOnboardingStore';

const HwConnectingPage = () => {
  const navigate = useNavigate();
  const setHardwareConnected = useOnboardingStore(
    (state) => state.setHardwareConnected,
  );

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setHardwareConnected(true);
      navigate('/onboarding/hardware/complete');
    }, 2000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [navigate, setHardwareConnected]);

  return (
    <OnboardingLayout
      title={'하드웨어를\n연결 중입니다.'}
      onBackClick={() => navigate('/onboarding/hardware')}
    >
      <div className="mt-[180px] flex flex-col items-center gap-lg">
        <div className="h-[48px] w-[48px] animate-spin rounded-full border-4 border-neutral-800 border-t-primary-400" />

        <p className="body-base-medium whitespace-pre-line text-center text-secondary">
          연결 상태를 확인하고 있어요.{'\n'}잠시만 기다려주세요.
        </p>
      </div>
    </OnboardingLayout>
  );
};

export default HwConnectingPage;
