import { create } from 'zustand';

import type { FavoriteAnswerTypes } from '@/pages/communication/types/communication-Types';

interface FavoriteAnswerState {
  answers: FavoriteAnswerTypes[];
  isInitialized: boolean;
  initialize: (answers: FavoriteAnswerTypes[]) => void;
  setAnswers: (answers: FavoriteAnswerTypes[]) => void;
  reset: () => void;
}

export const getNextAnswerId = (answers: FavoriteAnswerTypes[]) =>
  answers.reduce((maxId, answer) => Math.max(maxId, answer.id), 0) + 1;

export const useFavoriteAnswerStore = create<FavoriteAnswerState>((set) => ({
  answers: [],
  isInitialized: false,

  initialize: (answers) =>
    set((state) =>
      state.isInitialized ? state : { answers, isInitialized: true },
    ),

  setAnswers: (answers) => set({ answers }),

  reset: () => set({ answers: [], isInitialized: false }),
}));
