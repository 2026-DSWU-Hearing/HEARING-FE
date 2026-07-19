import LocationArrowIcon from '@/shared/components/icons/LocationArrowIcon';

interface CurrentLocationPropTypes {
  locationName: string;
}

const CurrentLocation = ({ locationName }: CurrentLocationPropTypes) => {
  return (
    <div className="flex items-center gap-xs text-primary">
      <LocationArrowIcon className="h-[1.0425rem] w-[1.04294rem] shrink-0" />
      <span className="heading-lg-semibold text-center">{locationName}</span>
    </div>
  );
};

export default CurrentLocation;
