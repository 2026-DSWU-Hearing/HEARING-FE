import SearchBar from '@/pages/home/components/SearchBar';
import CategoryBar from '@/pages/home/components/sound/CategoryBar';
import SoundCard from '@/pages/home/components/sound/SoundCard';
import { useSoundAddModal } from '@/pages/home/hooks/useSoundAddModal';
import type { SoundTypes } from '@/pages/home/types/soundTypes';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'motion/react';

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
    isLoading,
    isError,
    handleSearchKeywordChange,
    handleCategoryChange,
    handleSoundSelect,
    handleCompleteClick,
  } = useSoundAddModal({ onComplete });

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
            onClick={onClose}
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

          {isLoading && <p>소리 목록을 불러오는 중...</p>}
          {isError && <p>소리 목록을 불러오지 못했습니다</p>}
        </div>

        <div className="hide-scrollbar mt-5 flex-1 overflow-y-auto">
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
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SoundAddBottomModal;
