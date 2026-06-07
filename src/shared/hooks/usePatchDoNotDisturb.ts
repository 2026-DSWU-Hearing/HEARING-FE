import { useMutation } from '@tanstack/react-query';
import { patchDoNotDisturb } from '@/shared/apis/patchDoNotDisturb';

export const usePatchDoNotDisturb = () => {
  return useMutation({
    mutationFn: (doNotDisturb: boolean) =>
      patchDoNotDisturb({ do_not_disturb: doNotDisturb }),
  });
};
