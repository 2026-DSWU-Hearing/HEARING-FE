import { create } from 'zustand';

import type { AgreementId } from '@/pages/onboarding/constants/termsAgreementConstants';

type DisabilityType = 'deaf' | 'hardOfHearing';

interface OnboardingState {
  nickname: string;
  disabilityType: DisabilityType | null;
  agreements: Record<AgreementId, boolean>;
  setNickname: (nickname: string) => void;
  setDisabilityType: (disabilityType: DisabilityType) => void;
  toggleAgreement: (agreementId: AgreementId) => void;
  agreeAgreement: (agreementId: AgreementId) => void;
}
 
export const useOnboardingStore = create<OnboardingState>((set) => ({
  nickname: '',
  disabilityType: null,
  agreements: {
    service: false,
    privacy: false,
    sensitive: false,
    notification: false,
  },
  setNickname: (nickname) => set({ nickname }),
  setDisabilityType: (disabilityType) => set({ disabilityType }),
  toggleAgreement: (agreementId) =>
    set((state) => ({
      agreements: {
        ...state.agreements,
        [agreementId]: !state.agreements[agreementId],
      },
    })),
  agreeAgreement: (agreementId) =>
    set((state) => ({
      agreements: {
        ...state.agreements,
        [agreementId]: true,
      },
    })),
}));
