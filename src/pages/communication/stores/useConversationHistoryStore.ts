import { create } from 'zustand';

import type { ConversationHistoryDetailTypes } from '@/pages/communication/types/communication-Types';

interface ConversationHistoryState {
  histories: ConversationHistoryDetailTypes[];
  isInitialized: boolean;
  initialize: (histories: ConversationHistoryDetailTypes[]) => void;
  deleteHistory: (id: number) => void;
}

export const useConversationHistoryStore = create<ConversationHistoryState>(
  (set) => ({
    histories: [],
    isInitialized: false,

    initialize: (histories) =>
      set((state) =>
        state.isInitialized ? state : { histories, isInitialized: true },
      ),

    deleteHistory: (id) =>
      set((state) => ({
        histories: state.histories.filter((history) => history.id !== id),
      })),
  }),
);
