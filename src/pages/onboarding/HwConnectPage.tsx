import { useNavigate } from 'react-router-dom';

import LongConfirmButton from '@/pages/onboarding/components/LongConfirmButton';
import OnboardingLayout from '@/pages/onboarding/components/OnboardingLayout';
import OnboardingTopNavigation from '@/pages/onboarding/components/OnboardingTopNavigation';
import SkipButton from '@/pages/onboarding/components/SkipButton';
import { useOnboardingStore } from '@/pages/onboarding/stores/useOnboardingStore';
import connectIcon from '@/shared/assets/icons/onboarding/connect.svg';
import roundIcon from '@/shared/assets/icons/onboarding/round.svg';

const HwConnectPage = () => {
  const navigate = useNavigate();

  const resetHardwareConnection = useOnboardingStore(
    (state) => state.resetHardwareConnection,
  );

  const handleConnectButtonClick = () => {
    resetHardwareConnection();
    navigate('/onboarding/hardware/connecting');
  };

  const handleSkipButtonClick = () => {
    resetHardwareConnection();
    navigate('/');
  };

  return (
    <OnboardingLayout
      title={'하드웨어를\n연결하시겠습니까?'}
      topNavigation={
        <OnboardingTopNavigation
          onBackClick={() => navigate('/onboarding/terms')}
        />
      }
      bottomButton={
        <div className="flex w-full flex-col items-center gap-xs">
          <LongConfirmButton onClick={handleConnectButtonClick}>
            <span className="flex items-center justify-center gap-[10px]">
              디바이스 연결하기
              <img
                src={connectIcon}
                alt=""
                aria-hidden="true"
                className="h-icon-md w-icon-md"
              />
            </span>
          </LongConfirmButton>

          <SkipButton onClick={handleSkipButtonClick} />
        </div>
      }
    >
      <div className="mx-auto mt-[72px] flex h-[290px] w-[290px] items-center justify-center rounded-[290px] border-[0.5px] border-neutral-500">
        <div className="flex h-[214px] w-[214px] items-center justify-center rounded-full border-[0.5px] border-neutral-700">
          <img
            src={roundIcon}
            alt=""
            aria-hidden="true"
            className="h-[130px] w-[130px]"
          />
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default HwConnectPage;
