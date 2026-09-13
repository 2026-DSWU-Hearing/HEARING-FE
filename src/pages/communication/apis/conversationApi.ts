import http from '@/shared/apis/axios';
import type {
  ConversationBubbleRequestTypes,
  ConversationBubbleResponseTypes,
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
export const postConversation = async (location: ConversationLocationTypes) =>
  (await http.post<ConversationCreatedTypes>(getConversationUrl(), location))
    .data;
export const postConversationBubble = async (
  conversationId: number,
  bubble: ConversationBubbleRequestTypes,
) => {
  const content = bubble.content.trim();
  if (!content) throw new Error('빈 메시지는 저장할 수 없습니다.');
  return (
    await http.post<ConversationBubbleResponseTypes>(
      getConversationUrl(`/${conversationId}/bubbles`),
      { ...bubble, content },
    )
  ).data;
};
export const postConversationEnd = async (conversationId: number) =>
  (
    await http.post<ConversationEndTypes>(
      getConversationUrl(`/${conversationId}/end`),
    )
  ).data;
export const deleteConversation = async (
  conversationId: number,
): Promise<void> => {
  await http.delete(getConversationUrl(`/${conversationId}`));
};
