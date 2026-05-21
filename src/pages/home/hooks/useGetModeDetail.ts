import { useQuery } from '@tanstack/react-query';
import { getModeDetail } from '@/pages/home/apis/getModeDetail';

export const useGetModeDetail = (modeId: number) => {
  return useQuery({
    queryKey: ['modes', modeId],
    queryFn: () => getModeDetail(modeId),
  });
};
