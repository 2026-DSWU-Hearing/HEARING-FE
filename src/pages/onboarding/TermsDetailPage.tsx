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

  // 여기서는 동의 상태만 기록한다. 브라우저 알림 권한 요청은
  // 온보딩 완료(TermsPage의 "다음으로") 시점 한 곳으로 일원화했다.
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
