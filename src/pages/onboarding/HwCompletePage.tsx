import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import LongConfirmButton from '@/pages/onboarding/components/LongConfirmButton';
import OnboardingLayout from '@/pages/onboarding/components/OnboardingLayout';
import { useOnboardingStore } from '@/pages/onboarding/stores/useOnboardingStore';
import hearingIcon from '@/shared/assets/brand/hearing.svg';

const HwCompletePage = () => {
  const navigate = useNavigate();

  const setHardwareConnected = useOnboardingStore(
    (state) => state.setHardwareConnected,
  );

  useEffect(() => {
    setHardwareConnected(true);
  }, [setHardwareConnected]);

  return (
    <OnboardingLayout
      title="연결 완료!"
      onBackClick={() => navigate('/onboarding/hardware')}
      bottomButton={
        <div className="flex w-full flex-col gap-xs">
          <LongConfirmButton onClick={() => navigate('/')}>
            메인 화면으로 이동
          </LongConfirmButton>

        
        </div>
      }
    >
      <div className="relative mx-auto mt-[96px] h-[292px] w-[292px] overflow-visible">
        <div className="absolute left-[-146px] top-1/2 h-[292px] w-[292px] -translate-y-1/2 rounded-[292px] bg-[radial-gradient(47.15%_41.1%_at_47.6%_50%,rgba(255,226,110,0.20)_0%,rgba(255,226,110,0)_100%)]" />
        <div className="absolute right-[-146px] top-1/2 h-[292px] w-[292px] -translate-y-1/2 rounded-[292px] bg-[radial-gradient(47.15%_41.1%_at_47.6%_50%,rgba(255,226,110,0.20)_0%,rgba(255,226,110,0)_100%)]" />

        <div className="absolute left-1/2 top-1/2 z-10 h-[290px] w-[290px] -translate-x-1/2 -translate-y-1/2 rounded-[290px] bg-[radial-gradient(86.06%_75%_at_75%_50%,rgba(255,226,110,0)_75.96%,rgba(255,226,110,0.50)_100%)]" />
        <div className="absolute left-1/2 top-1/2 z-10 h-[290px] w-[290px] -translate-x-1/2 -translate-y-1/2 scale-x-[-1] rounded-[290px] bg-[radial-gradient(86.06%_75%_at_75%_50%,rgba(255,226,110,0)_75.96%,rgba(255,226,110,0.50)_100%)]" />

        <div className="absolute left-1/2 top-1/2 z-20 h-[214px] w-[214px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(86.06%_75%_at_75%_50%,rgba(255,226,110,0)_75.96%,rgba(255,226,110,0.35)_100%)]" />
        <div className="absolute left-1/2 top-1/2 z-20 h-[214px] w-[214px] -translate-x-1/2 -translate-y-1/2 scale-x-[-1] rounded-full bg-[radial-gradient(86.06%_75%_at_75%_50%,rgba(255,226,110,0)_75.96%,rgba(255,226,110,0.35)_100%)]" />

        <div className="absolute left-1/2 top-1/2 z-30 h-[152px] w-[152px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(75%_75%_at_75%_50%,rgba(255,226,110,0)_75.96%,rgba(255,226,110,0.15)_100%)]" />
        <div className="absolute left-1/2 top-1/2 z-30 h-[152px] w-[152px] -translate-x-1/2 -translate-y-1/2 scale-x-[-1] rounded-full bg-[radial-gradient(75%_75%_at_75%_50%,rgba(255,226,110,0)_75.96%,rgba(255,226,110,0.15)_100%)]" />

        <img
          src={hearingIcon}
          alt=""
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 z-40 aspect-square h-[76px] w-[76px] -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </OnboardingLayout>
  );
};

export default HwCompletePage;
