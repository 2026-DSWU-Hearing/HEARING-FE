import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LocationConsentStateTypes {
  isLocationAgreed: boolean;
  isPromptDeclined: boolean;
  setLocationAgreed: (isLocationAgreed: boolean) => void;
  declinePrompt: () => void;
  resetPrompt: () => void;
  reset: () => void;
}

const LOCATION_CONSENT_STORAGE_KEY = 'location-consent';

export const useLocationConsentStore = create<LocationConsentStateTypes>()(
  persist(
    (set) => ({
      isLocationAgreed: false,
      isPromptDeclined: false,

      setLocationAgreed: (isLocationAgreed) =>
        set({ isLocationAgreed, isPromptDeclined: false }),

      declinePrompt: () => set({ isPromptDeclined: true }),

      resetPrompt: () => set({ isPromptDeclined: false }),

      reset: () => set({ isLocationAgreed: false, isPromptDeclined: false }),
    }),
    {
      name: LOCATION_CONSENT_STORAGE_KEY,
      partialize: ({ isLocationAgreed }) => ({ isLocationAgreed }),
    },
  ),
);
