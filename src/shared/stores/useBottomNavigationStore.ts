import { create } from 'zustand';

interface BottomNavigationStateTypes {
  isHiddenByModal: boolean;
  setHiddenByModal: (isHiddenByModal: boolean) => void;
}

export const useBottomNavigationStore = create<BottomNavigationStateTypes>(
  (set) => ({
    isHiddenByModal: false,
    setHiddenByModal: (isHiddenByModal) => set({ isHiddenByModal }),
  }),
);
