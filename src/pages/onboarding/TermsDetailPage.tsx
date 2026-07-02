import { Navigate, useNavigate, useParams } from 'react-router-dom';

import TermsDetailLayout from '@/pages/onboarding/components/TermsDetailLayout';
import { AGREEMENT_ITEMS } from '@/pages/onboarding/constants/termsAgreementConstants';

const TermsDetailPage = () => {
  const navigate = useNavigate();
  const { agreementId } = useParams();

  const agreement = AGREEMENT_ITEMS.find(({ id }) => id === agreementId);

  if (!agreement) {
    return <Navigate to="/onboarding/terms" replace />;
  }

  return (
    <TermsDetailLayout
      title={agreement.detailTitle}
      onBackClick={() => navigate('/onboarding/terms')}
      onAgreeClick={() =>
        navigate('/onboarding/terms', {
          state: { agreedAgreementId: agreement.id },
        })
      }
    >
      {agreement.detailContent}
    </TermsDetailLayout>
  );
};

export default TermsDetailPage;
