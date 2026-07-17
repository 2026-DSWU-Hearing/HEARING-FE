import { useNavigate } from 'react-router-dom';

import LongConfirmButton from '@/pages/onboarding/components/LongConfirmButton';
import OnboardingLayout from '@/pages/onboarding/components/OnboardingLayout';
import OnboardingTopNavigation from '@/pages/onboarding/components/OnboardingTopNavigation';
import SkipButton from '@/pages/onboarding/components/SkipButton';
import { useOnboardingStore } from '@/pages/onboarding/stores/useOnboardingStore';
import DeviceRegisterModal from '@/shared/components/DeviceRegisterModal';
import { DEVICE_MESSAGE } from '@/shared/constants/deviceMessages';
import { useModal } from '@/shared/hooks/useModal';
import { usePostDevice } from '@/shared/hooks/usePostDevice';
import connectIcon from '@/shared/assets/icons/onboarding/connect.svg';
import roundIcon from '@/shared/assets/icons/onboarding/round.svg';

const HwConnectPage = () => {
  const navigate = useNavigate();

  const resetHardwareConnection = useOnboardingStore(
    (state) => state.resetHardwareConnection,
  );

  const registerModal = useModal();
  const {
    mutate: createDevice,
    isPending: isCreating,
    isError: isCreateError,
    reset: resetCreate,
  } = usePostDevice();

  const handleConnectButtonClick = () => {
    resetHardwareConnection();
    registerModal.open();
  };

  // 모달을 닫을 때 이전 실패 상태를 지운다.
  // 남겨두면 다시 열었을 때 지난 에러 메시지가 그대로 보인다.
  const handleCloseRegisterModal = () => {
    registerModal.close();
    resetCreate();
  };

  const handleRegisterSubmit = (nickname: string) => {
    if (isCreating) return;

    createDevice(
      { nickname },
      {
        // 등록에 성공해야 기다릴 기기가 생긴다. 실패 시에는 모달을 유지해 사유를 보여준다.
        // (연결 대기 페이지로 넘어가면 페이지가 언마운트되므로 모달을 닫을 필요가 없다.)
        onSuccess: () => navigate('/onboarding/hardware/connecting'),
      },
    );
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

      {registerModal.isOpen && (
        <DeviceRegisterModal
          onClose={handleCloseRegisterModal}
          onSubmit={handleRegisterSubmit}
          isPending={isCreating}
          errorMessage={
            isCreateError ? DEVICE_MESSAGE.REGISTER_FAILED : undefined
          }
        />
      )}
    </OnboardingLayout>
  );
};

export default HwConnectPage;
