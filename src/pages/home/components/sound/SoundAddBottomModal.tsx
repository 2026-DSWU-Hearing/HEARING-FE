import SearchBar from '@/pages/home/components/SearchBar';
import CategoryBar from '@/pages/home/components/sound/CategoryBar';
import SoundCard from '@/pages/home/components/sound/SoundCard';
import { useSoundAddModal } from '@/pages/home/hooks/useSoundAddModal';
import type { SoundTypes } from '@/pages/home/types/soundTypes';

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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45">
      <div className="flex h-[76dvh] w-full max-w-[430px] flex-col rounded-t-[32px] bg-white px-6 pb-8 pt-6">
        <div className="mb-8 flex flex-shrink-0 items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-4xl leading-none"
            aria-label="소리 추가 닫기"
          >
            ×
          </button>
          <h2 className="text-xl font-bold">소리 추가하기</h2>
          <button
            type="button"
            onClick={handleCompleteClick}
            className="text-base font-bold"
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

        <div className="mt-5 flex-1 overflow-y-auto">
          <div className="grid grid-cols-3 gap-3">
            {filteredSounds.map((sound) => (
              <SoundCard
                key={sound.id}
                sound={sound}
                isEditMode
                isSelected={selectedSoundIds.includes(sound.id)}
                onClick={handleSoundSelect}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoundAddBottomModal;
