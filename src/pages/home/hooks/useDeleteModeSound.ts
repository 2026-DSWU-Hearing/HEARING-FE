import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteModeSound } from '../apis/deleteModeSound';

export const useDeleteModeSound = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ modeId, soundId }: { modeId: number; soundId: number }) =>
      deleteModeSound(modeId, soundId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['modes'] });
      queryClient.invalidateQueries({ queryKey: ['modes', variables.modeId] });
    },
  });
};
