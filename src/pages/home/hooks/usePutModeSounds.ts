import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdateModeSoundsRequestTypes } from '@/pages/home/types/soundTypes';
import { putModeSounds } from '../apis/putModeSounds';

export const usePutModeSounds = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      modeId,
      soundsData,
    }: {
      modeId: number;
      soundsData: UpdateModeSoundsRequestTypes;
    }) => putModeSounds(modeId, soundsData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['modes'] });
      queryClient.invalidateQueries({ queryKey: ['modes', variables.modeId] });
    },
  });
};
