import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import LongConfirmButton from '@/pages/onboarding/components/LongConfirmButton';
import OnboardingLayout from '@/pages/onboarding/components/OnboardingLayout';
import TermsAgreementList from '@/pages/onboarding/components/TermsAgreementList';
import {
  AGREEMENT_ITEMS,
  type AgreementId,
} from '@/pages/onboarding/constants/termsAgreementConstants';

interface TermsLocationStateTypes {
  agreedAgreementId?: AgreementId;
}

const TermsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { agreedAgreementId } =
    (location.state as TermsLocationStateTypes | null) ?? {};

  const [checkedAgreements, setCheckedAgreements] = useState<
    Record<AgreementId, boolean>
  >({
    service: false,
    privacy: false,
    sensitive: false,
    notification: false,
  });

  useEffect(() => {
    if (!agreedAgreementId) return;

    setCheckedAgreements((prevAgreements) => ({
      ...prevAgreements,
      [agreedAgreementId]: true,
    }));

    navigate('/onboarding/terms', { replace: true, state: null });
  }, [agreedAgreementId, navigate]);

  const isNextButtonDisabled = AGREEMENT_ITEMS.some(
    ({ id, isRequired }) => isRequired && !checkedAgreements[id],
  );

  const handleAgreementToggle = (id: AgreementId) => {
    setCheckedAgreements((prevAgreements) => ({
      ...prevAgreements,
      [id]: !prevAgreements[id],
    }));
  };

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
          checkedAgreements={checkedAgreements}
          onAgreementToggle={handleAgreementToggle}
          onDetailClick={navigate}
        />
      </div>
    </OnboardingLayout>
  );
};

export default TermsPage;
