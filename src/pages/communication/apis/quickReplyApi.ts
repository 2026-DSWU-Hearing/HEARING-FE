import http from '@/shared/apis/axios';
import type {
  QuickReplyCreatedTypes,
  QuickReplyListTypes,
  QuickReplyTypes,
} from '@/pages/communication/types/quickReplyApiTypes';

const QUICK_REPLY_URL = '/api/quick-replies';

// 빈 문구는 저장할 수 없다(서버도 거부하지만 요청 전에 걸러 낭비를 줄인다).
const requireContent = (content: string) => {
  const trimmedContent = content.trim();
  if (!trimmedContent) throw new Error('빈 문구는 저장할 수 없습니다.');

  return trimmedContent;
};

export const getQuickReplies = async () =>
  (await http.get<QuickReplyListTypes>(QUICK_REPLY_URL)).data;

export const postQuickReply = async (content: string) =>
  (
    await http.post<QuickReplyCreatedTypes>(QUICK_REPLY_URL, {
      content: requireContent(content),
    })
  ).data;

export const putQuickReply = async (replyId: number, content: string) =>
  (
    await http.put<QuickReplyTypes>(`${QUICK_REPLY_URL}/${replyId}`, {
      content: requireContent(content),
    })
  ).data;

export const deleteQuickReply = async (replyId: number): Promise<void> => {
  await http.delete(`${QUICK_REPLY_URL}/${replyId}`);
};
