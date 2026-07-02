import { useNavigate } from 'react-router-dom';

import LongConfirmButton from '@/pages/onboarding/components/LongConfirmButton';
import OnboardingLayout from '@/pages/onboarding/components/OnboardingLayout';
import { useOnboardingStore } from '@/pages/onboarding/stores/useOnboardingStore';

const HwConnectPage = () => {
  const navigate = useNavigate();
  const setHardwareConnected = useOnboardingStore(
    (state) => state.setHardwareConnected,
  );

  const handleSkipButtonClick = () => {
    setHardwareConnected(false);
    navigate('/');
  };

  const handleConnectButtonClick = () => {
    navigate('/onboarding/hardware/connecting');
  };

  return (
    <OnboardingLayout
      title={'하드웨어를\n연결하시겠습니까?'}
      onBackClick={() => navigate('/onboarding/terms')}
      bottomButton={
        <div className="flex w-full flex-col gap-base">
          <LongConfirmButton onClick={handleConnectButtonClick}>
            연결하기
          </LongConfirmButton>

          <button
            type="button"
            onClick={handleSkipButtonClick}
            className="heading-base-semibold flex h-[42px] w-full items-center justify-center rounded-pill text-secondary"
          >
            나중에 하기
          </button>
        </div>
      }
    >
      <p className="body-base-medium mt-[206px] whitespace-pre-line text-secondary">
        하드웨어를 연결하면{'\n'}소리 감지 알림을 더 정확하게 받을 수 있어요.
      </p>
    </OnboardingLayout>
  );
};

export default HwConnectPage;
