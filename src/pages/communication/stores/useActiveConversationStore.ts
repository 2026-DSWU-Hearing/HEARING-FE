import { create } from 'zustand';

import {
  deleteConversation,
  postConversation,
  postConversationEnd,
} from '@/pages/communication/apis/conversationApi';
import { getConversationLocation } from '@/pages/communication/utils/getConversationLocation';
import type {
  ConversationBubbleRequestTypes,
  ConversationCreatedTypes,
  ConversationEndTypes,
} from '@/pages/communication/types/conversationApiTypes';

// 진행 중인 대화의 서버 세션만 들고 있는 스토어.
//
// 화면에 쌓이는 버블은 useCommunicationPage가 들고 있고, 기록 보관은
// useConversationHistoryStore(localStorage)가 한다. 여기는 서버와의 연결만 맡는다.
//   - 마이크를 켜기 전에 대화를 만든다(STT 소켓 주소에 대화 id가 필요해서).
//   - 대화를 끝낼 때 버블 전체를 한 번에 올린다.
//
// 버블을 하나씩 올리지 않는 이유: 중간 저장은 네트워크가 끊기면 어차피 유실되는데,
// 기록은 localStorage가 오프라인에서도 확실히 들고 있다. 대신 대화 도중의 순서 보장
// (전송 큐, 직렬화, 늦게 온 응답 무시)이 전부 필요 없어져 흐름이 단순해진다.
interface ActiveConversationStateTypes {
  conversation: ConversationCreatedTypes | null;
  isCreating: boolean;
  isSaving: boolean;
  error: string;
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

    return {
      conversation: null,
      isCreating: false,
      isSaving: false,
      error: '',

      ensureConversation: () => {
        const existing = get().conversation;
        if (existing) return Promise.resolve(existing);
        if (creation) return creation;

        const currentGeneration = generation;
        set({ isCreating: true, error: '' });

        const request = getConversationLocation()
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
        const conversation = get().conversation;
        if (!conversation) return null;

        const currentGeneration = generation;
        set({ isSaving: true, error: '' });

        try {
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
              error:
                '대화를 서버에 저장하지 못했습니다. 기록은 이 기기에 남아 있어요.',
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
