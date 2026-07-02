import { useNavigate } from 'react-router-dom';

import LongConfirmButton from '@/pages/onboarding/components/LongConfirmButton';
import OnboardingLayout from '@/pages/onboarding/components/OnboardingLayout';

const HwCompletePage = () => {
  const navigate = useNavigate();

  return (
    <OnboardingLayout
      title={'연결 완료!'}
      onBackClick={() => navigate('/onboarding/hardware')}
      bottomButton={
        <LongConfirmButton onClick={() => navigate('/')}>
          시작하기
        </LongConfirmButton>
      }
    ></OnboardingLayout>
  );
};

export default HwCompletePage;
