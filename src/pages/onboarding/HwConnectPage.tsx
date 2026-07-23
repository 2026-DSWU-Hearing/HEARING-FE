import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import LongConfirmButton from '@/pages/onboarding/components/LongConfirmButton';
import OnboardingLayout from '@/pages/onboarding/components/OnboardingLayout';
import OnboardingTopNavigation from '@/pages/onboarding/components/OnboardingTopNavigation';
import SkipButton from '@/pages/onboarding/components/SkipButton';
import { useOnboardingStore } from '@/pages/onboarding/stores/useOnboardingStore';
import { DEVICE_MESSAGE } from '@/shared/constants/deviceMessages';
import { useDevicesConnect } from '@/shared/hooks/useDevicesConnect';
import connectIcon from '@/shared/assets/icons/onboarding/connect.svg';
import roundIcon from '@/shared/assets/icons/onboarding/round.svg';

const HwConnectPage = () => {
  const [hasConnectError, setHasConnectError] = useState(false);
  const navigate = useNavigate();

  const resetHardwareConnection = useOnboardingStore(
    (state) => state.resetHardwareConnection,
  );
  const setHardwareConnected = useOnboardingStore(
    (state) => state.setHardwareConnected,
  );
  const setConnectedDevice = useOnboardingStore(
    (state) => state.setConnectedDevice,
  );

  const { mutateAsync: connectDevice, isPending: isConnecting } =
    useDevicesConnect();

  const handleConnectButtonClick = async () => {
    if (isConnecting) return;

    resetHardwareConnection();
    setHasConnectError(false);

    try {
      const connectedDevice = await connectDevice();
      setConnectedDevice(connectedDevice);
      setHardwareConnected(true);
      navigate('/onboarding/hardware/complete');
    } catch {
      setHasConnectError(true);
    }
  };

  const handleSkipButtonClick = () => {
    resetHardwareConnection();
    navigate('/');
  };

  const connectButtonText = isConnecting
    ? DEVICE_MESSAGE.CONNECTING_BUTTON
    : hasConnectError
      ? '다시 시도'
      : '디바이스 연결하기';

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
          {hasConnectError && (
            <p className="w-full whitespace-pre-line px-base py-1 text-center caption-xs-regular text-state-alert">
              {DEVICE_MESSAGE.CONNECT_FAILED}
            </p>
          )}
          <LongConfirmButton
            onClick={handleConnectButtonClick}
            disabled={isConnecting}
          >
            <span className="flex items-center justify-center gap-[10px]">
              {connectButtonText}
              {!isConnecting && (
                <img
                  src={connectIcon}
                  alt=""
                  aria-hidden="true"
                  className="h-icon-md w-icon-md"
                />
              )}
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
