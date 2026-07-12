import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchAgreement } from '@/pages/setting/apis/patchAgreement';


export const usePatchAgreement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchAgreement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    },
  });
};
