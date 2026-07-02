import { create } from 'zustand';

import type { AgreementId } from '@/pages/onboarding/constants/termsAgreementConstants';
import type { DisabilityType } from '@/pages/onboarding/types/onboardingTypes';

interface OnboardingState {
  nickname: string;
  disabilityType: DisabilityType | null;
  agreements: Record<AgreementId, boolean>;
  isHardwareConnected: boolean;
  setNickname: (nickname: string) => void;
  setDisabilityType: (disabilityType: DisabilityType) => void;
  toggleAgreement: (agreementId: AgreementId) => void;
  agreeAgreement: (agreementId: AgreementId) => void;
  setHardwareConnected: (isHardwareConnected: boolean) => void;
  resetOnboarding: () => void;
}

const INITIAL_AGREEMENTS: Record<AgreementId, boolean> = {
  service: false,
  privacy: false,
  sensitive: false,
  notification: false,
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  nickname: '',
  disabilityType: null,
  agreements: { ...INITIAL_AGREEMENTS },
  isHardwareConnected: false,

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

  setHardwareConnected: (isHardwareConnected) => set({ isHardwareConnected }),

  resetOnboarding: () =>
    set({
      nickname: '',
      disabilityType: null,
      agreements: { ...INITIAL_AGREEMENTS },
      isHardwareConnected: false,
    }),
}));
