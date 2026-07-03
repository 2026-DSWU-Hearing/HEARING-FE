import type { Dispatch, SetStateAction } from 'react';

export type DisabilityType = 'deaf' | 'hardOfHearing';

export interface OnboardingFormTypes {
  nickname: string;
  disabilityType: DisabilityType | null;
}

export interface OnboardingContextTypes {
  form: OnboardingFormTypes;
  setForm: Dispatch<SetStateAction<OnboardingFormTypes>>;
}