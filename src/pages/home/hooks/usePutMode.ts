import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdateModeRequestTypes } from '@/pages/home/types/modeTypes';
import { putMode } from '@/pages/home/apis/putMode';

export const usePutMode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      modeId,
      modeData,
    }: {
      modeId: number;
      modeData: UpdateModeRequestTypes;
    }) => putMode(modeId, modeData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['modes'] });
      queryClient.invalidateQueries({
        queryKey: ['modes', variables.modeId],
      });
    },
  });
};
