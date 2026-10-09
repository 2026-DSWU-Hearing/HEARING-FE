import { useInfiniteQuery } from '@tanstack/react-query';

import { getConversations } from '@/pages/communication/apis/conversationApi';
import {
  CONVERSATION_LIST_QUERY_KEY,
  CONVERSATION_PAGE_SIZE,
} from '@/pages/communication/constants/conversationQueryKeys';

export const useGetConversations = () => {
  return useInfiniteQuery({
    queryKey: CONVERSATION_LIST_QUERY_KEY,
    queryFn: ({ pageParam }) =>
      getConversations(pageParam, CONVERSATION_PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: ({ has_next: hasNext, page }) =>
      hasNext ? page + 1 : undefined,
  });
};
