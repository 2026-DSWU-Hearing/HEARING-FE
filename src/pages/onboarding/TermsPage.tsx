import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import LongConfirmButton from '@/pages/onboarding/components/LongConfirmButton';
import OnboardingLayout from '@/pages/onboarding/components/OnboardingLayout';
import TermsAgreementList from '@/pages/onboarding/components/TermsAgreementList';
import type {
  AgreementId,
  AgreementItemTypes,
} from '@/pages/onboarding/components/TermsAgreementList';

const AGREEMENT_ITEMS: AgreementItemTypes[] = [
  {
    id: 'service',
    label: '서비스 이용약관 동의',
    isRequired: true,
    detailPath: '/onboarding/terms/service',
  },
  {
    id: 'privacy',
    label: '개인정보 수집 및 이용 동의',
    isRequired: true,
    detailPath: '/onboarding/terms/privacy',
  },
  {
    id: 'sensitive',
    label: '민감정보 수집 및 이용 동의',
    isRequired: true,
    detailPath: '/onboarding/terms/sensitive',
  },
  {
    id: 'notification',
    label: '소리 필터 및 모드 알림 수신 동의',
    isRequired: false,
    detailPath: '/onboarding/terms/notification',
  },
];

const TermsPage = () => {
  const navigate = useNavigate();

  const [checkedAgreements, setCheckedAgreements] = useState<
    Record<AgreementId, boolean>
  >({
    service: false,
    privacy: false,
    sensitive: false,
    notification: false,
  });

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
