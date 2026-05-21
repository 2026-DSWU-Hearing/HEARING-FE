import { useQuery } from '@tanstack/react-query';
import { getSoundCategories } from '../apis/getSoundCategories';

export const useGetSoundCategories = () => {
  return useQuery({
    queryKey: ['soundCategories'],
    queryFn: getSoundCategories,
  });
};
