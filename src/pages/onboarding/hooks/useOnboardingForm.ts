import { useContext } from 'react';

import { OnboardingFormContext } from '@/pages/onboarding/contexts/onboardingFormContext';

export const useOnboardingForm = () => {
  const context = useContext(OnboardingFormContext);

  if (!context) {
    throw new Error(
      'useOnboardingForm은 OnboardingFormProvider 내부에서 사용해야 합니다.',
    );
  }

  return context;
};