import { useQuery } from '@tanstack/react-query';
import { getSounds } from '@/pages/home/apis/getSounds';

export const useGetSounds = () => {
  return useQuery({
    queryKey: ['sounds'],
    queryFn: getSounds,
  });
};
