import { useNavigate } from 'react-router-dom';

import LongConfirmButton from '@/pages/onboarding/components/LongConfirmButton';
import OnboardingLayout from '@/pages/onboarding/components/OnboardingLayout';
import OnboardingTopNavigation from '@/pages/onboarding/components/OnboardingTopNavigation';
import TermsAgreementList from '@/pages/onboarding/components/TermsAgreementList';
import { AGREEMENT_ITEMS } from '@/pages/onboarding/constants/termsAgreementConstants';
import { useOnboardingStore } from '@/pages/onboarding/stores/useOnboardingStore';
import { usePatchUsers } from '@/pages/setting/hooks/usePatchUsers';
import { usePatchAgreement } from '@/pages/setting/hooks/usePatchAgreement';
import { usePatchPushEnabled } from '@/pages/setting/hooks/usePatchPushEnabled';
import { useFcmToken } from '@/pages/setting/hooks/useFcmToken';

const TermsPage = () => {
  const navigate = useNavigate();

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
      // 알림 수신 동의(선택) 여부를 서버 push_enabled에 그대로 반영한다.
      // 동의하지 않았으면 false로 저장되어 설정 페이지 표시와 일치한다.
      await updatePushEnabled({ push_enabled: agreements.notification });

      // 동의한 경우에만, 사용자 클릭 제스처 안에서 브라우저 알림 권한을 요청한다.
      if (agreements.notification) {
        await handleRequestPermission();
      }

      navigate('/onboarding/hardware');
    } catch (error) {
      console.error('온보딩 정보 저장 실패:', error);
      alert('정보 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
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
  );
};

export default TermsPage;
