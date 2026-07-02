export type DisabilityType = 'deaf' | 'hardOfHearing';

export interface OnboardingFormTypes {
  nickname: string;
  disabilityType: DisabilityType | null;
}
