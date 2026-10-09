import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postQuickReply } from '@/pages/communication/apis/quickReplyApi';
import { QUICK_REPLY_QUERY_KEY } from '@/pages/communication/constants/quickReplyQueryKeys';

export const usePostQuickReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postQuickReply,
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: QUICK_REPLY_QUERY_KEY }),
  });
};
