import { useQueryClient, useMutation } from '@tanstack/react-query';
import { patchActivateMode } from '@/pages/home/apis/patchActivateMode';

export const usePatchActivateMode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (modeId: number) => patchActivateMode(modeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modes'] });
    },
  });
};
