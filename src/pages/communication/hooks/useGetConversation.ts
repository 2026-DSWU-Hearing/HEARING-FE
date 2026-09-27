import { useQuery } from '@tanstack/react-query';

import { getConversation } from '@/pages/communication/apis/conversationApi';
import { CONVERSATION_DETAIL_QUERY_KEY } from '@/pages/communication/constants/conversationQueryKeys';

export const useGetConversation = (conversationId: number) => {
  return useQuery({
    queryKey: CONVERSATION_DETAIL_QUERY_KEY(conversationId),
    queryFn: () => getConversation(conversationId),
    enabled: Number.isInteger(conversationId) && conversationId > 0,
  });
};
