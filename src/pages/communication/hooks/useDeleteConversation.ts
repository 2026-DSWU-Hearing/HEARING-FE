import type { InfiniteData } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteConversation } from '@/pages/communication/apis/conversationApi';
import {
  CONVERSATION_DETAIL_QUERY_KEY,
  CONVERSATION_LIST_QUERY_KEY,
} from '@/pages/communication/constants/conversationQueryKeys';
import type { ConversationListTypes } from '@/pages/communication/types/conversationApiTypes';

export const useDeleteConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteConversation,
    onSuccess: (_, conversationId) => {
      queryClient.setQueryData<InfiniteData<ConversationListTypes, number>>(
        CONVERSATION_LIST_QUERY_KEY,
        (data) =>
          data && {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              conversations: page.conversations.filter(
                ({ conversation_id: id }) => id !== conversationId,
              ),
            })),
          },
      );
      queryClient.removeQueries({
        queryKey: CONVERSATION_DETAIL_QUERY_KEY(conversationId),
      });
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: CONVERSATION_LIST_QUERY_KEY }),
  });
};
