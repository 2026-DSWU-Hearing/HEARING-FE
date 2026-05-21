import { useQuery } from '@tanstack/react-query';
import { getModeDetail } from '@/pages/home/apis/getModeDetail';

export const useGetModeDetail = (modeId: number | null) => {
  return useQuery({
    queryKey: ['modes', modeId],
    queryFn: () => getModeDetail(modeId ?? 0),
    enabled: modeId !== null,
  });
};
