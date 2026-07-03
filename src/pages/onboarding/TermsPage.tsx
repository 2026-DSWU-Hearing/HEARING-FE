import { useNavigate } from 'react-router-dom';

import LongConfirmButton from '@/pages/onboarding/components/LongConfirmButton';
import OnboardingLayout from '@/pages/onboarding/components/OnboardingLayout';
import TermsAgreementList from '@/pages/onboarding/components/TermsAgreementList';
import { AGREEMENT_ITEMS } from '@/pages/onboarding/constants/termsAgreementConstants';
import { useOnboardingStore } from '@/pages/onboarding/stores/useOnboardingStore';

const TermsPage = () => {
  const navigate = useNavigate();

  const agreements = useOnboardingStore((state) => state.agreements);
  const toggleAgreement = useOnboardingStore((state) => state.toggleAgreement);

  const isNextButtonDisabled = AGREEMENT_ITEMS.some(
    ({ id, isRequired }) => isRequired && !agreements[id],
  );

  const handleNextButtonClick = () => {
    if (isNextButtonDisabled) return;

    navigate('/onboarding/hardware');
  };

  return (
    <OnboardingLayout
      title={'고객님\n환영합니다!'}
      onBackClick={() => navigate('/onboarding/disability')}
      bottomButton={
        <LongConfirmButton
          disabled={isNextButtonDisabled}
          onClick={handleNextButtonClick}
        >
          다음으로
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
