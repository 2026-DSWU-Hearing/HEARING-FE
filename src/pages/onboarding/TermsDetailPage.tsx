import { Navigate, useNavigate, useParams } from 'react-router-dom';

import TermsDetailLayout from '@/pages/onboarding/components/TermsDetailLayout';
import { AGREEMENT_ITEMS } from '@/pages/onboarding/constants/termsAgreementConstants';
import { useOnboardingStore } from '@/pages/onboarding/stores/useOnboardingStore';

const TermsDetailPage = () => {
  const navigate = useNavigate();
  const { agreementId } = useParams();

  const agreeAgreement = useOnboardingStore((state) => state.agreeAgreement);

  const agreement = AGREEMENT_ITEMS.find(({ id }) => id === agreementId);

  if (!agreement) {
    return <Navigate to="/onboarding/terms" replace />;
  }

  const handleAgreeClick = () => {
    agreeAgreement(agreement.id);
    navigate('/onboarding/terms');
  };

  return (
    <TermsDetailLayout
      title={agreement.detailTitle}
      onBackClick={() => navigate('/onboarding/terms')}
      onAgreeClick={handleAgreeClick}
    >
      {agreement.detailContent}
    </TermsDetailLayout>
  );
};

export default TermsDetailPage;
