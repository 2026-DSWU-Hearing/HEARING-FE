import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  deleteQuickReply,
  postQuickReply,
  putQuickReply,
} from '@/pages/communication/apis/quickReplyApi';
import { QUICK_REPLY_QUERY_KEY } from '@/pages/communication/constants/quickReplyQueryKeys';
import type { FavoriteAnswerTypes } from '@/pages/communication/types/communication-Types';

interface SaveQuickRepliesParamsTypes {
  previousAnswers: FavoriteAnswerTypes[];
  nextAnswers: FavoriteAnswerTypes[];
}

const saveQuickReplies = async ({
  previousAnswers,
  nextAnswers,
}: SaveQuickRepliesParamsTypes) => {
  const nextIds = new Set(nextAnswers.map(({ id }) => id));
  const previousContents = new Map(
    previousAnswers.map(({ id, content }) => [id, content]),
  );

  for (const { id } of previousAnswers) {
    if (!nextIds.has(id)) await deleteQuickReply(id);
  }

  for (const { id, content } of nextAnswers) {
    const previousContent = previousContents.get(id);

    if (previousContent === undefined) {
      await postQuickReply(content);
    } else if (previousContent !== content) {
      await putQuickReply(id, content);
    }
  }
};

export const useSaveQuickReplies = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveQuickReplies,
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: QUICK_REPLY_QUERY_KEY }),
  });
};
