import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import LongConfirmButton from '@/pages/onboarding/components/LongConfirmButton';
import OnboardingLayout from '@/pages/onboarding/components/OnboardingLayout';
import OnboardingTopNavigation from '@/pages/onboarding/components/OnboardingTopNavigation';
import TermsAgreementList from '@/pages/onboarding/components/TermsAgreementList';
import { ONBOARDING_MESSAGE } from '@/pages/onboarding/constants/onboardingMessages';
import { AGREEMENT_ITEMS } from '@/pages/onboarding/constants/termsAgreementConstants';
import { useOnboardingStore } from '@/pages/onboarding/stores/useOnboardingStore';
import { usePatchUsers } from '@/pages/setting/hooks/usePatchUsers';
import { usePatchAgreement } from '@/pages/setting/hooks/usePatchAgreement';
import { usePatchPushEnabled } from '@/pages/setting/hooks/usePatchPushEnabled';
import AlertModal from '@/shared/components/AlertModal';
import { isNotificationSupported } from '@/shared/firebase/settingFCM';
import { useFcmToken } from '@/shared/hooks/useFcmToken';

const NEXT_ONBOARDING_PATH = '/onboarding/hardware';

const TermsPage = () => {
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState('');

  const nickname = useOnboardingStore((state) => state.nickname);
  const disabilityType = useOnboardingStore((state) => state.disabilityType);
  const agreements = useOnboardingStore((state) => state.agreements);
  const toggleAgreement = useOnboardingStore((state) => state.toggleAgreement);

  const { mutateAsync: updateUsers } = usePatchUsers();
  const { mutateAsync: updateAgreement, isPending: isSubmitting } =
    usePatchAgreement();
  const { mutateAsync: updatePushEnabled } = usePatchPushEnabled();
  const { handleRequestPermission } = useFcmToken();

  const isRequiredAgreementMissing = AGREEMENT_ITEMS.some(
    ({ id, isRequired }) => isRequired && !agreements[id],
  );
  const isNextButtonDisabled = isRequiredAgreementMissing || isSubmitting;

  const handleNextButtonClick = async () => {
    if (isNextButtonDisabled) return;

    try {
      // 온보딩에서 모아둔 닉네임, 장애유형, 약관동의 정보를 이 시점에 한 번에 제출
      await updateUsers({ nickname, disability_type: disabilityType });
      await updateAgreement({ terms_agreed: true });

      // 동의한 경우에만, 사용자 클릭 제스처 안에서 브라우저 알림 권한을 요청한다.
      // 동의(의사)가 아니라 토큰 발급 성공(실제 수신 가능 여부)으로 push_enabled를 정한다.
      // 권한 거부나 토큰 발급 실패는 예외가 아닌 null로 오므로 반환값으로만 판별할 수 있다.
      let pushEnabled = false;
      if (agreements.notification) {
        const fcmToken = await handleRequestPermission();
        pushEnabled = Boolean(fcmToken);
      }
      await updatePushEnabled({ push_enabled: pushEnabled });

      // 알림을 원했는데 사용자가 권한을 거부한 경우에만 안내한다.
      // 훅의 permission 상태는 이 핸들러 안에서 아직 갱신 전이므로 브라우저 값을 직접 읽는다.
      // 미지원 환경이나 토큰 발급 실패는 설정에서 해결할 수 없어 안내 대상에서 제외한다.
      const isPermissionDenied =
        isNotificationSupported() && Notification.permission === 'denied';

      if (agreements.notification && !pushEnabled && isPermissionDenied) {
        setAlertMessage(ONBOARDING_MESSAGE.NOTIFICATION_PERMISSION_DENIED);
        return;
      }

      navigate(NEXT_ONBOARDING_PATH);
    } catch (error) {
      console.error('온보딩 정보 저장 실패:', error);
      setAlertMessage(ONBOARDING_MESSAGE.SAVE_FAIL);
    }
  };

  // 권한 거부 안내는 온보딩을 막지 않는다. 확인 후 다음 단계로 이어간다.
  // 저장 실패 안내는 재시도해야 하므로 페이지에 머문다.
  const handleAlertModalClose = () => {
    const isPermissionAlert =
      alertMessage === ONBOARDING_MESSAGE.NOTIFICATION_PERMISSION_DENIED;

    setAlertMessage('');
    if (isPermissionAlert) navigate(NEXT_ONBOARDING_PATH);
  };

  return (
    <>
      <OnboardingLayout
        title={'고객님\n환영합니다!'}
        topNavigation={
          <OnboardingTopNavigation
            onBackClick={() => navigate('/onboarding/disability')}
          />
        }
        bottomButton={
          <LongConfirmButton
            disabled={isNextButtonDisabled}
            onClick={handleNextButtonClick}
          >
            {isSubmitting ? '저장 중...' : '다음으로'}
          </LongConfirmButton>
        }
      >
        <div className="mt-auto mb-[43px] w-full">
          <TermsAgreementList
            agreements={AGREEMENT_ITEMS}
            checkedAgreements={agreements}
            onAgreementToggle={toggleAgreement}
            onDetailClick={navigate}
          />
        </div>
      </OnboardingLayout>
      <AlertModal
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={handleAlertModalClose}
      />
    </>
  );
};

export default TermsPage;
