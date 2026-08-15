import { create } from 'zustand';

import type { AgreementId } from '@/pages/onboarding/constants/termsAgreementConstants';
import type { DeviceResponseTypes } from '@/shared/types/deviceApiTypes';
import type { DisabilityTypeTypes } from '@/pages/setting/constants/disabilityType';

interface OnboardingState {
  nickname: string;
  disabilityType: DisabilityTypeTypes | null;
  agreements: Record<AgreementId, boolean>;
  isHardwareConnected: boolean;
  connectedDevice: DeviceResponseTypes | null;

  setNickname: (nickname: string) => void;
  setDisabilityType: (disabilityType: DisabilityTypeTypes) => void;
  toggleAgreement: (agreementId: AgreementId) => void;
  agreeAgreement: (agreementId: AgreementId) => void;
  setHardwareConnected: (isHardwareConnected: boolean) => void;
  setConnectedDevice: (device: DeviceResponseTypes | null) => void;
  resetHardwareConnection: () => void;
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
  connectedDevice: null,

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

  setConnectedDevice: (device) => set({ connectedDevice: device }),

  // 하드웨어 연결하기/나중에 하기 등 "연결 시도를 취소"하는 지점에서 공통으로 쓴다.
  resetHardwareConnection: () =>
    set({ isHardwareConnected: false, connectedDevice: null }),

  resetOnboarding: () =>
    set({
      nickname: '',
      disabilityType: null,
      agreements: { ...INITIAL_AGREEMENTS },
      isHardwareConnected: false,
      connectedDevice: null,
    }),
}));
