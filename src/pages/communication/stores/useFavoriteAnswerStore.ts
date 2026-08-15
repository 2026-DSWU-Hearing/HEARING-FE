import { create } from 'zustand';

import type { FavoriteAnswerTypes } from '@/pages/communication/types/communication-Types';

interface FavoriteAnswerState {
  answers: FavoriteAnswerTypes[];
  isInitialized: boolean;
  initialize: (answers: FavoriteAnswerTypes[]) => void;
  addAnswer: (content: string) => void;
  setAnswers: (answers: FavoriteAnswerTypes[]) => void;
}

const getNextAnswerId = (answers: FavoriteAnswerTypes[]) =>
  answers.reduce((maxId, answer) => Math.max(maxId, answer.id), 0) + 1;

export const useFavoriteAnswerStore = create<FavoriteAnswerState>((set) => ({
  answers: [],
  isInitialized: false,

  initialize: (answers) =>
    set((state) =>
      state.isInitialized ? state : { answers, isInitialized: true },
    ),

  addAnswer: (content) =>
    set((state) => ({
      answers: [
        ...state.answers,
        { id: getNextAnswerId(state.answers), content },
      ],
    })),

  setAnswers: (answers) => set({ answers }),
}));
