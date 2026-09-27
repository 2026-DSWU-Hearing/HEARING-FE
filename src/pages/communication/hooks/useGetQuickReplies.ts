import { useQuery } from '@tanstack/react-query';

import { getQuickReplies } from '@/pages/communication/apis/quickReplyApi';
import { QUICK_REPLY_QUERY_KEY } from '@/pages/communication/constants/quickReplyQueryKeys';
import type { FavoriteAnswerTypes } from '@/pages/communication/types/communication-Types';
import type { QuickReplyListTypes } from '@/pages/communication/types/quickReplyApiTypes';

const toFavoriteAnswers = ({
  quick_replies: quickReplies,
}: QuickReplyListTypes): FavoriteAnswerTypes[] =>
  quickReplies.map(({ reply_id: id, content }) => ({ id, content }));

export const useGetQuickReplies = () => {
  return useQuery({
    queryKey: QUICK_REPLY_QUERY_KEY,
    queryFn: getQuickReplies,
    select: toFavoriteAnswers,
  });
};
