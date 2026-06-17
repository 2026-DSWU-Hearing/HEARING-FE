import Skeleton from 'react-loading-skeleton';

interface SoundCardSkeletonPropTypes {
  bgClassName?: string;
}

const SoundCardSkeleton = ({
  bgClassName = 'bg-neutral-800',
}: SoundCardSkeletonPropTypes) => {
  return (
    <div className={`aspect-square rounded-xl p-sm ${bgClassName}`}>
      <div className="flex h-full flex-col items-center justify-center gap-xs">
        <Skeleton circle width="2.5rem" height="2.5rem" />
        <Skeleton width="3.5rem" height="0.875rem" />
        <Skeleton width="2.5rem" height="1rem" borderRadius="0.5rem" />
      </div>
    </div>
  );
};

export default SoundCardSkeleton;
