import { useQuery } from '@tanstack/react-query';

import { getHomeSoundFilteringData } from '../apis/soundFilteringApi';

export const useHomeSoundFilteringData = () => {
  return useQuery({
    queryKey: ['homeSoundFilteringData'],
    queryFn: getHomeSoundFilteringData,
  });
};
