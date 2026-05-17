import { useQuery } from '@tanstack/react-query';

import { getSoundLibraryData } from '../apis/soundFilteringApi';

export const useSoundLibraryData = () => {
  return useQuery({
    queryKey: ['soundLibraryData'],
    queryFn: getSoundLibraryData,
  });
};
