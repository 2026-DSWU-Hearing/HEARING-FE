import { useQuery } from '@tanstack/react-query';
import { getModes } from '@/pages/home/apis/modeApi';

export const useGetModes = () => {
  return useQuery({
    queryKey: ['modes'],
    queryFn: getModes,
  });
};
