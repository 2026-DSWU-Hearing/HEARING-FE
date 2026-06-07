import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import SearchBar from '@/pages/home/components/SearchBar';
import ModeSoundSelectBlock from '@/pages/home/components/modeForm/ModeSoundSelectBlock';
import { useModeFormContext } from '@/pages/home/components/modeForm/ModeFormContext';
import { useModeSoundSelectSection } from '@/pages/home/hooks/useModeSoundSelectSection';

const ModeSoundSelectSection = () => {
  const { selectedSoundIds, handleSoundToggle } = useModeFormContext();
  const {
    categorySoundGroups,
    hasNoSearchResult,
    isError,
    isLoading,
    isSearching,
    openedCategoryId,
    searchKeyword,
    handleCategoryToggleClick,
    handleSearchKeywordChange,
  } = useModeSoundSelectSection();

  return (
    <section
      aria-labelledby="sound-select-heading"
      className="space-y-base mb-[3rem]"
    >
      <div className="flex items-center justify-between gap-base mb-lg">
        <h2 id="sound-select-heading" className="heading-base-semibold">
          소리 선택
        </h2>
        <span className="body-base-regular shrink-0 text-primary-500">
          {selectedSoundIds.length}개 선택됨
        </span>
      </div>

      <SearchBar
        value={searchKeyword}
        placeholder="원하는 소리를 검색해보세요"
        onChange={handleSearchKeywordChange}
      />

      {isLoading && (
        <p className="body-sm-regular text-tertiary">
          소리 목록을 불러오는 중...
        </p>
      )}
      {isError && (
        <p className="body-sm-regular text-state-alert">
          소리 목록을 불러오지 못했습니다
        </p>
      )}
      {hasNoSearchResult && (
        <p className="body-sm-regular text-tertiary">검색 결과가 없습니다</p>
      )}

      {!isLoading && !isError && !hasNoSearchResult && (
        <div className="space-y-sm">
          {categorySoundGroups.map(({ category, sounds }) => {
            const isOpened =
              isSearching || openedCategoryId === category.category_id;

            return (
              <div key={category.category_id}>
                <button
                  type="button"
                  aria-expanded={isOpened}
                  onClick={() =>
                    handleCategoryToggleClick(category.category_id)
                  }
                  className="flex h-[2.25rem] w-full items-center justify-between rounded-pill bg-neutral-800 px-base text-left transition-colors active:bg-neutral-700"
                >
                  <span className="min-w-0 truncate body-sm-regular text-primary">
                    {category.name}
                  </span>
                  <FontAwesomeIcon
                    icon={isOpened ? faChevronDown : faChevronRight}
                    className="ml-sm h-icon-sm text-secondary"
                  />
                </button>

                {isOpened && (
                  <div className="mt-xs space-y-xs">
                    {sounds.length > 0 ? (
                      sounds.map((sound) => (
                        <ModeSoundSelectBlock
                          key={sound.sound_id}
                          sound={sound}
                          isSelected={selectedSoundIds.includes(sound.sound_id)}
                          onToggle={handleSoundToggle}
                        />
                      ))
                    ) : (
                      <p className="px-base py-xs body-sm-regular text-tertiary">
                        선택할 수 있는 소리가 없습니다
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ModeSoundSelectSection;
