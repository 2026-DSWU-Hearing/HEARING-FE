import { create } from 'zustand';

import type { FavoriteAnswerTypes } from '@/pages/communication/types/communication-Types';

interface FavoriteAnswerState {
  answers: FavoriteAnswerTypes[];
  isInitialized: boolean;
  initialize: (answers: FavoriteAnswerTypes[]) => void;
}

export const useFavoriteAnswerStore = create<FavoriteAnswerState>((set) => ({
  answers: [],
  isInitialized: false,

  initialize: (answers) =>
    set((state) =>
      state.isInitialized ? state : { answers, isInitialized: true },
    ),
}));
