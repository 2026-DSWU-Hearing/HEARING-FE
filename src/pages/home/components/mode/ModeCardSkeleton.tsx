import Skeleton from 'react-loading-skeleton';

const ModeCardSkeleton = () => {
  return (
    <div className="flex h-full w-full flex-col justify-between rounded-xl bg-neutral-800 p-sm">
      <Skeleton circle width="3rem" height="3rem" />
      <div className="mt-base">
        <Skeleton width="60%" height="1rem" />
      </div>
    </div>
  );
};

export default ModeCardSkeleton;
