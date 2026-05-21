import { useQueryClient, useMutation } from '@tanstack/react-query';
import { deleteMode } from '@/pages/home/apis/deleteMode';

export const useDeleteMode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (modeId: number) => deleteMode(modeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modes'] });
    },
  });
};
