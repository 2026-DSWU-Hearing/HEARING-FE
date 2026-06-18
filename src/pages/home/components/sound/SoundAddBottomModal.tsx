import SearchBar from '@/pages/home/components/SearchBar';
import CategoryBar from '@/pages/home/components/sound/CategoryBar';
import SoundCard from '@/pages/home/components/sound/SoundCard';
import SoundCardSkeleton from '@/pages/home/components/sound/SoundCardSkeleton';
import { MODE_MESSAGE } from '@/pages/home/constants/modeMessages';
import { useSoundAddModal } from '@/pages/home/hooks/useSoundAddModal';
import type { SoundTypes } from '@/pages/home/types/soundTypes';
import ConfirmModal from '@/shared/components/ConfirmModal';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'motion/react';
import { SkeletonTheme } from 'react-loading-skeleton';

const SKELETON_SOUND_COUNT = 9;

interface SoundAddBottomModalPropTypes {
  onClose: () => void;
  onComplete: (sounds: SoundTypes[]) => void;
}

const SoundAddBottomModal = ({
  onClose,
  onComplete,
}: SoundAddBottomModalPropTypes) => {
  const {
    searchKeyword,
    selectedCategory,
    selectedSoundIds,
    filteredSounds,
    hasNoSearchResult,
    isLoading,
    isError,
    isCancelConfirmOpen,
    closeCancelConfirm,
    handleSearchKeywordChange,
    handleCategoryChange,
    handleSoundSelect,
    handleCompleteClick,
    handleCloseClick,
    handleCancelConfirm,
  } = useSoundAddModal({ onComplete, onClose });

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#000000]/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="flex h-[76dvh] w-full max-w-[430px] flex-col rounded-t-[32px] bg-neutral-800 p-xl"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 320 }}
      >
        <div className="mb-8 flex flex-shrink-0 items-center justify-between">
          <button
            type="button"
            onClick={handleCloseClick}
            className="w-[1.5rem] leading-none"
            aria-label="소리 추가 닫기"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <h2 className="heading-base-semibold">소리 추가하기</h2>
          <button
            type="button"
            onClick={handleCompleteClick}
            className="heading-base-semibold "
          >
            완료
          </button>
        </div>

        <div className="flex flex-shrink-0 flex-col gap-5">
          <SearchBar
            value={searchKeyword}
            onChange={handleSearchKeywordChange}
            placeholder="원하는 소리를 검색하세요"
          />
          <CategoryBar
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />

          {isError && <p>소리 목록을 불러오지 못했습니다</p>}
        </div>

        <div className="hide-scrollbar mt-5 flex-1 overflow-y-auto">
          {isLoading ? (
            <SkeletonTheme baseColor="#4a4b47" highlightColor="#5e5f5a">
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: SKELETON_SOUND_COUNT }).map((_, index) => (
                  <SoundCardSkeleton key={index} bgClassName="bg-neutral-700" />
                ))}
              </div>
            </SkeletonTheme>
          ) : hasNoSearchResult ? (
            <p className="body-sm-regular text-secondary text-center">
              검색 결과가 없습니다.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {filteredSounds.map((sound) => (
                <SoundCard
                  key={sound.sound_id}
                  sound={sound}
                  isEditMode
                  isSelected={selectedSoundIds.includes(sound.sound_id)}
                  onClick={handleSoundSelect}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <ConfirmModal
        isOpen={isCancelConfirmOpen}
        message={MODE_MESSAGE.CANCEL_CONFIRM}
        onConfirm={handleCancelConfirm}
        onCancel={() => {}}
        onClose={closeCancelConfirm}
      />
    </motion.div>
  );
};

export default SoundAddBottomModal;
