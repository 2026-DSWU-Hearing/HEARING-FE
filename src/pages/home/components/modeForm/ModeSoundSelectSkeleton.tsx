import Skeleton from 'react-loading-skeleton';

const SKELETON_CATEGORY_COUNT = 5;

const ModeSoundSelectSkeleton = () => {
  return (
    <div className="space-y-sm">
      {Array.from({ length: SKELETON_CATEGORY_COUNT }).map((_, index) => (
        <div key={index} className="h-[2.25rem]">
          <Skeleton
            height="2.25rem"
            borderRadius="999px"
            className="block leading-none"
          />
        </div>
      ))}
    </div>
  );
};

export default ModeSoundSelectSkeleton;
