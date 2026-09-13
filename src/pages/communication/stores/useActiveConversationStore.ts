import { create } from 'zustand';
import {
  postConversation,
  postConversationBubble,
} from '@/pages/communication/apis/conversationApi';
import { getConversationLocation } from '@/pages/communication/utils/getConversationLocation';
import type {
  ConversationBubbleRequestTypes,
  ConversationCreatedTypes,
} from '@/pages/communication/types/conversationApiTypes';
import type { ChatBubbleTypes } from '@/pages/communication/types/communicationTypes';

interface PendingBubbleTypes extends ConversationBubbleRequestTypes {
  localId: number;
}
interface ActiveConversationStateTypes {
  conversation: ConversationCreatedTypes | null;
  bubbles: ChatBubbleTypes[];
  pending: PendingBubbleTypes[];
  isCreating: boolean;
  isSaving: boolean;
  error: string;
  ensureConversation: () => Promise<ConversationCreatedTypes>;
  submit: (bubble: ConversationBubbleRequestTypes) => void;
  flush: () => Promise<boolean>;
  reset: () => void;
}
export const useActiveConversationStore = create<ActiveConversationStateTypes>(
  (set, get) => {
    let generation = 0;
    let nextLocalId = -1;
    let creation: Promise<ConversationCreatedTypes> | null = null;
    let saving: Promise<boolean> | null = null;
    return {
      conversation: null,
      bubbles: [],
      pending: [],
      isCreating: false,
      isSaving: false,
      error: '',
      ensureConversation: () => {
        if (get().conversation) return Promise.resolve(get().conversation!);
        if (creation) return creation;
        const currentGeneration = generation;
        set({ isCreating: true, error: '' });
        const request = getConversationLocation()
          .then((location) => {
            if (generation !== currentGeneration)
              throw new Error('세션이 종료되었습니다.');
            return postConversation(location);
          })
          .then((conversation) => {
            if (generation === currentGeneration) set({ conversation });
            return conversation;
          })
          .catch((error: unknown) => {
            if (generation === currentGeneration)
              set({ error: '대화를 시작하지 못했습니다. 다시 시도해 주세요.' });
            throw error;
          })
          .finally(() => {
            if (generation === currentGeneration) set({ isCreating: false });
            if (creation === request) creation = null;
          });
        creation = request;
        return request;
      },
      submit: (bubble) => {
        const content = bubble.content.trim();
        if (!content || !get().conversation) return;
        const localId = nextLocalId--;
        set((state) => ({
          bubbles: [...state.bubbles, { ...bubble, content, id: localId }],
          pending: [...state.pending, { ...bubble, content, localId }],
        }));
        if (!get().error) void get().flush();
      },
      flush: () => {
        if (saving) return saving;
        const currentGeneration = generation;
        const conversation = get().conversation;
        if (!conversation) return Promise.resolve(false);
        set({ isSaving: true, error: '' });
        const request = (async () => {
          while (generation === currentGeneration && get().pending.length) {
            const { localId, ...body } = get().pending[0];
            try {
              const bubble = await postConversationBubble(
                conversation.conversation_id,
                body,
              );
              if (generation !== currentGeneration) return false;
              set((state) => ({
                bubbles: state.bubbles.map((item) =>
                  item.id === localId
                    ? { ...bubble, id: bubble.bubble_id }
                    : item,
                ),
                pending: state.pending.filter(
                  (item) => item.localId !== localId,
                ),
              }));
            } catch {
              if (generation === currentGeneration)
                set({
                  error:
                    '메시지 저장을 확인하지 못했습니다. 종료 전에 다시 시도해 주세요.',
                });
              return false;
            }
          }
          return generation === currentGeneration;
        })().finally(() => {
          if (generation === currentGeneration) set({ isSaving: false });
          if (saving === request) saving = null;
        });
        saving = request;
        return request;
      },
      reset: () => {
        generation += 1;
        creation = null;
        saving = null;
        set({
          conversation: null,
          bubbles: [],
          pending: [],
          isCreating: false,
          isSaving: false,
          error: '',
        });
      },
    };
  },
);
