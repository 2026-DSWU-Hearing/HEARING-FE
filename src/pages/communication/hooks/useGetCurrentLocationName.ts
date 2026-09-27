import { useQuery } from '@tanstack/react-query';

import { CURRENT_LOCATION_QUERY_KEY } from '@/pages/communication/constants/conversationQueryKeys';
import { LOCATION_MESSAGE } from '@/pages/communication/constants/locationMessages';
import { useGetLocationName } from '@/pages/communication/hooks/useGetLocationName';
import { getConversationLocation } from '@/pages/communication/utils/getConversationLocation';

const CURRENT_LOCATION_STALE_TIME = 60_000;

export const useGetCurrentLocationName = () => {
  const { data: location, isSuccess: isLocationLoaded } = useQuery({
    queryKey: CURRENT_LOCATION_QUERY_KEY,
    queryFn: getConversationLocation,
    staleTime: CURRENT_LOCATION_STALE_TIME,
  });

  const latitude = location?.latitude ?? null;
  const longitude = location?.longitude ?? null;

  const {
    data: locationName,
    isSuccess: isLocationNameLoaded,
    isError: isLocationNameError,
  } = useGetLocationName({ latitude, longitude });

  if (!isLocationLoaded) return '';
  if (latitude === null || longitude === null) {
    return LOCATION_MESSAGE.PERMISSION_REQUIRED;
  }
  if (isLocationNameError || (isLocationNameLoaded && !locationName)) {
    return LOCATION_MESSAGE.UNKNOWN;
  }

  return locationName ?? '';
};
