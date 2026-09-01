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

  // 로그아웃 시 호출한다. isInitialized까지 되돌려야 다음 사용자가 로그인했을 때
  // initialize가 다시 동작한다(true로 남아 있으면 이전 사용자 답변이 그대로 보인다).
  reset: () => set({ answers: [], isInitialized: false }),
}));
