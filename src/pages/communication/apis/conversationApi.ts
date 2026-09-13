import http from '@/shared/apis/axios';
import type {
  ConversationBubbleRequestTypes,
  ConversationCreatedTypes,
  ConversationDetailTypes,
  ConversationEndTypes,
  ConversationListTypes,
  ConversationLocationTypes,
} from '@/pages/communication/types/conversationApiTypes';

const getConversationUrl = (suffix = '') =>
  new URL(
    `/api/conversations${suffix}`,
    new URL(http.defaults.baseURL || '/', window.location.origin),
  ).href;

export const getConversations = async (page: number, limit = 20) =>
  (
    await http.get<ConversationListTypes>(getConversationUrl(), {
      params: { page, limit },
    })
  ).data;
export const getConversation = async (conversationId: number) =>
  (
    await http.get<ConversationDetailTypes>(
      getConversationUrl(`/${conversationId}`),
    )
  ).data;
// STT 소켓 주소에 대화 id가 필요해서, 마이크를 켜기 전에 대화부터 만든다.
export const postConversation = async (location: ConversationLocationTypes) =>
  (await http.post<ConversationCreatedTypes>(getConversationUrl(), location))
    .data;
// 대화 전체를 한 번에 올린다. 서버는 이 시점에 제목/요약을 생성한다.
// 빈 내용은 서버가 거부하므로 보내기 전에 걸러낸다.
export const postConversationEnd = async (
  conversationId: number,
  bubbles: ConversationBubbleRequestTypes[],
) =>
  (
    await http.post<ConversationEndTypes>(
      getConversationUrl(`/${conversationId}/end`),
      {
        bubbles: bubbles
          .map((bubble) => ({ ...bubble, content: bubble.content.trim() }))
          .filter((bubble) => bubble.content),
      },
    )
  ).data;
export const deleteConversation = async (
  conversationId: number,
): Promise<void> => {
  await http.delete(getConversationUrl(`/${conversationId}`));
};
