import { createContext } from 'react';

import type { OnboardingFormTypes } from '@/pages/onboarding/types/onboardingTypes';

interface OnboardingFormContextTypes {
  onboardingForm: OnboardingFormTypes;
  updateOnboardingForm: (form: Partial<OnboardingFormTypes>) => void;
}

export const OnboardingFormContext =
  createContext<OnboardingFormContextTypes | null>(null);