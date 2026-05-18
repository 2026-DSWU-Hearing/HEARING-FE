
interface CurrentLocationPropTypes {
  locationName: string;
}

const CurrentLocation = ({ locationName }: CurrentLocationPropTypes) => {
  return (
    <div className=" px-4 py-2 text-sm font-medium text-gray-700">
      {locationName}
    </div>
  );
};

export default CurrentLocation;
