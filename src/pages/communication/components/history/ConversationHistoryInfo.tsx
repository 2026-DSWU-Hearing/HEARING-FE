import { LOCATION_MESSAGE } from '@/pages/communication/constants/locationMessages';
import { useGetLocationName } from '@/pages/communication/hooks/useGetLocationName';
import type { ConversationLocationTypes } from '@/pages/communication/types/conversationApiTypes';
import { formatConversationDate } from '@/pages/communication/utils/formatConversationDate';
import { formatConversationTime } from '@/pages/communication/utils/formatConversationTime';
import LocationArrowIcon from '@/shared/components/icons/LocationArrowIcon';

interface ConversationHistoryInfoPropTypes extends ConversationLocationTypes {
  startedAt: string;
}

const ConversationHistoryInfo = ({
  startedAt,
  latitude,
  longitude,
}: ConversationHistoryInfoPropTypes) => {
  const {
    data: locationName,
    isPending,
    isError,
  } = useGetLocationName({ latitude, longitude });

  const hasCoordinates = latitude !== null && longitude !== null;
  const locationText =
    hasCoordinates && isPending
      ? ''
      : isError || !locationName
        ? LOCATION_MESSAGE.UNKNOWN
        : locationName;

  return (
    <div className="flex flex-col items-center gap-xxs px-base pt-sm text-center">
      <p className="body-sm-regular text-tertiary">
        {formatConversationDate(startedAt)} {formatConversationTime(startedAt)}
      </p>

      {locationText && (
        <p className="body-sm-regular flex items-center gap-xxs text-tertiary">
          <LocationArrowIcon className="h-[0.75rem] w-[0.75rem] shrink-0" />
          {locationText}
        </p>
      )}
    </div>
  );
};

export default ConversationHistoryInfo;
