import { create } from 'zustand';

import {
  deleteConversation,
  postConversation,
  postConversationEnd,
} from '@/pages/communication/apis/conversationApi';
import { getConversationLocation } from '@/pages/communication/utils/getConversationLocation';
import { useLocationConsentStore } from '@/shared/stores/useLocationConsentStore';
import type { ChatBubbleTypes } from '@/pages/communication/types/communication-Types';
import type {
  ConversationBubbleRequestTypes,
  ConversationCreatedTypes,
  ConversationEndTypes,
} from '@/pages/communication/types/conversationApiTypes';

// 진행 중인 대화의 서버 세션만 들고 있는 스토어.
//
// 화면에 쌓이는 버블은 useCommunicationPage가 들고 있고, 여기는 서버와의 연결만 맡는다.
//   - 마이크를 켜기 전에 대화를 만든다(STT 소켓 주소에 대화 id가 필요해서).
//   - 대화를 끝낼 때 버블 전체를 한 번에 올린다.
interface ActiveConversationStateTypes {
  conversation: ConversationCreatedTypes | null;
  isCreating: boolean;
  isSaving: boolean;
  error: string;
  bubbles: ChatBubbleTypes[];
  addBubble: (bubble: Omit<ChatBubbleTypes, 'id'>) => void;
  removeSavedBubbles: (savedCount: number) => void;
  clearBubbles: () => void;
  ensureConversation: () => Promise<ConversationCreatedTypes>;
  // 버블이 비어 있으면 저장 대신 대화를 지운다. 저장할 게 없으면 서버에 빈 대화가 남으므로.
  end: (
    bubbles: ConversationBubbleRequestTypes[],
  ) => Promise<ConversationEndTypes | null>;
  reset: () => void;
}

export const useActiveConversationStore = create<ActiveConversationStateTypes>(
  (set, get) => {
    // reset 이후에 도착한 응답이 새 대화를 덮어쓰지 않도록 세대를 센다.
    let generation = 0;
    // 같은 대화를 두 번 만들지 않도록 진행 중인 생성 요청을 공유한다.
    let creation: Promise<ConversationCreatedTypes> | null = null;
    let nextBubbleId = 1;

    return {
      conversation: null,
      isCreating: false,
      isSaving: false,
      error: '',
      bubbles: [],

      addBubble: (bubble) => {
        const id = nextBubbleId;
        nextBubbleId += 1;
        set((state) => ({ bubbles: [...state.bubbles, { ...bubble, id }] }));
      },

      removeSavedBubbles: (savedCount) =>
        set((state) => ({ bubbles: state.bubbles.slice(savedCount) })),

      clearBubbles: () => set({ bubbles: [] }),

      ensureConversation: () => {
        const existing = get().conversation;
        if (existing) return Promise.resolve(existing);
        if (creation) return creation;

        const currentGeneration = generation;
        set({ isCreating: true, error: '' });

        const { isLocationAgreed } = useLocationConsentStore.getState();
        const locationRequest = isLocationAgreed
          ? getConversationLocation()
          : Promise.resolve({ latitude: null, longitude: null });

        const request = locationRequest
          .then((location) => {
            if (generation !== currentGeneration) {
              throw new Error('세션이 종료되었습니다.');
            }

            return postConversation(location);
          })
          .then((conversation) => {
            if (generation === currentGeneration) set({ conversation });

            return conversation;
          })
          .catch((error: unknown) => {
            if (generation === currentGeneration) {
              set({ error: '대화를 시작하지 못했습니다. 다시 시도해 주세요.' });
            }

            throw error;
          })
          .finally(() => {
            if (generation === currentGeneration) set({ isCreating: false });
            if (creation === request) creation = null;
          });

        creation = request;

        return request;
      },

      end: async (bubbles) => {
        if (get().isSaving) return null;
        if (!get().conversation && bubbles.length === 0) return null;

        const currentGeneration = generation;
        set({ isSaving: true, error: '' });

        try {
          const conversation =
            get().conversation ?? (await get().ensureConversation());

          // 마이크만 켰다 끈 경우. 올릴 내용이 없으니 만들어둔 대화를 지운다.
          if (bubbles.length === 0) {
            await deleteConversation(conversation.conversation_id);

            return null;
          }

          return await postConversationEnd(
            conversation.conversation_id,
            bubbles,
          );
        } catch (error) {
          console.error('[대화] 종료 처리 실패:', error);
          if (generation === currentGeneration) {
            set({
              error: '대화를 저장하지 못했습니다. 다시 시도해 주세요.',
            });
          }

          return null;
        } finally {
          if (generation === currentGeneration) {
            // 성공이든 실패든 다음 대화는 새로 시작한다.
            // (실패한 대화를 계속 붙들고 있으면 다음 녹음이 남의 대화에 붙는다.)
            set({ conversation: null, isSaving: false });
          }
        }
      },

      reset: () => {
        generation += 1;
        creation = null;
        set({
          conversation: null,
          isCreating: false,
          isSaving: false,
          error: '',
        });
      },
    };
  },
);
