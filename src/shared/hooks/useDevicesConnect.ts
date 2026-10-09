import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postDevicesConnect } from '@/shared/apis/postDevicesConnect';

export const useDevicesConnect = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postDevicesConnect,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
  });
};
