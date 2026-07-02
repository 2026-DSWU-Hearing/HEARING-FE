import { useState } from 'react';
import type { PropsWithChildren } from 'react';

import { INITIAL_ONBOARDING_FORM } from '@/pages/onboarding/constants/onboardingConstants';
import { OnboardingFormContext } from '@/pages/onboarding/contexts/onboardingFormContext';
import type { OnboardingFormTypes } from '@/pages/onboarding/types/onboardingTypes';

const OnboardingFormProvider = ({ children }: PropsWithChildren) => {
  const [onboardingForm, setOnboardingForm] =
    useState<OnboardingFormTypes>(INITIAL_ONBOARDING_FORM);

  const updateOnboardingForm = (form: Partial<OnboardingFormTypes>) => {
    setOnboardingForm((prevForm) => ({
      ...prevForm,
      ...form,
    }));
  };

  return (
    <OnboardingFormContext.Provider
      value={{
        onboardingForm,
        updateOnboardingForm,
      }}
    >
      {children}
    </OnboardingFormContext.Provider>
  );
};

export default OnboardingFormProvider;