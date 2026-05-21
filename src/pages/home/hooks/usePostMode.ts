import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postMode } from '@/pages/home/apis/postMode';
import type { CreateModeRequestTypes } from '@/pages/home/types/modeTypes';

export const usePostMode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (modeData: CreateModeRequestTypes) => postMode(modeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modes'] });
    },
  });
};
