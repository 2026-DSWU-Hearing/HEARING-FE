export type DisabilityTypeTypes = 'DEAF' | 'HARD_OF_HEARING' | '';

export interface OnboardingFormTypes {
  nickname: string;
  disabilityType: DisabilityTypeTypes;
  isTermsAgreed: boolean;
  isPrivacyAgreed: boolean;
  isHardwareConnected: boolean;
}

export interface OnboardingContextTypes {
  onboardingForm: OnboardingFormTypes;
  updateOnboardingForm: (values: Partial<OnboardingFormTypes>) => void;
}
