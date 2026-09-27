import { useQuery } from '@tanstack/react-query';

import { getLocationName } from '@/pages/communication/apis/getLocationName';
import { LOCATION_NAME_QUERY_KEY } from '@/pages/communication/constants/conversationQueryKeys';
import type { ConversationLocationTypes } from '@/pages/communication/types/conversationApiTypes';

const COORDINATE_PRECISION = 1000;
const LOCATION_NAME_GC_TIME = 24 * 60 * 60 * 1000;

const roundCoordinate = (coordinate: number) =>
  Math.round(coordinate * COORDINATE_PRECISION) / COORDINATE_PRECISION;

export const useGetLocationName = ({
  latitude,
  longitude,
}: ConversationLocationTypes) => {
  const roundedLatitude = latitude === null ? null : roundCoordinate(latitude);
  const roundedLongitude =
    longitude === null ? null : roundCoordinate(longitude);

  return useQuery({
    queryKey: LOCATION_NAME_QUERY_KEY(
      roundedLatitude ?? 0,
      roundedLongitude ?? 0,
    ),
    queryFn: () =>
      roundedLatitude === null || roundedLongitude === null
        ? Promise.resolve(null)
        : getLocationName(roundedLatitude, roundedLongitude),
    enabled: roundedLatitude !== null && roundedLongitude !== null,
    staleTime: Infinity,
    gcTime: LOCATION_NAME_GC_TIME,
    retry: 1,
  });
};
