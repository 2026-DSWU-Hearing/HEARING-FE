import AddBtn from '@/pages/home/components/AddButton';
import ModeCard from '@/pages/home/components/mode/ModeCard';
import ModeCardSkeleton from '@/pages/home/components/mode/ModeCardSkeleton';
import { useModeList } from '@/pages/home/hooks/useModeList';
import QueryErrorState from '@/shared/components/QueryErrorState';

const SKELETON_MODE_COUNT = 3;

const ModeList = () => {
  const {
    modes,
    selectedModeId,
    isDoNotDisturb,
    isLoading,
    isError,
    isFetching,
    handleRetryClick,
  } = useModeList();

  return (
    <section className="mt-8">
      {isError && (
        <QueryErrorState
          message="모드 목록을 불러오지 못했습니다"
          isRetrying={isFetching}
          onRetry={handleRetryClick}
        />
      )}
      <div className="grid grid-cols-3 gap-base">
        {isLoading
          ? Array.from({ length: SKELETON_MODE_COUNT }).map((_, index) => (
              <ModeCardSkeleton key={index} />
            ))
          : modes.map((mode) => (
              <ModeCard
                key={mode.mode_id}
                mode={mode}
                isSelected={mode.mode_id === selectedModeId}
                isDoNotDisturb={isDoNotDisturb}
              />
            ))}
      </div>

      <div className="mt-lg mb-[1.38rem] flex justify-center">
        <AddBtn label="새 모드 추가하기" to="/modes/new" />
      </div>
    </section>
  );
};

export default ModeList;
