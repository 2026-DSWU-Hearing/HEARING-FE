import { createContext } from 'react';

import type { OnboardingContextTypes } from '../types/onboardingTypes';

export const OnboardingFormContext =
  createContext<OnboardingContextTypes | null>(null);
