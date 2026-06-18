import { useCallback, useMemo, useState } from 'react';
import { useGetSoundCategories } from '@/pages/home/hooks/useGetSoundCategories';
import { useGetSounds } from '@/pages/home/hooks/useGetSounds';
import type {
  CategoryTypes,
  SoundTypes,
} from '@/pages/home/types/soundTypes';

interface CategorySoundGroupTypes {
  category: CategoryTypes;
  sounds: SoundTypes[];
}

const createCategoriesFromSounds = (sounds: SoundTypes[]) => {
  const categoryMap = new Map<number, CategoryTypes>();

  sounds.forEach((sound) => {
    if (!categoryMap.has(sound.category_id)) {
      categoryMap.set(sound.category_id, {
        category_id: sound.category_id,
        name: sound.category_name,
      });
    }
  });

  return [...categoryMap.values()];
};

export const useModeSoundSelectSection = () => {
  const {
    data: soundsData,
    isLoading: isSoundsLoading,
    isError: isSoundsError,
  } = useGetSounds();
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useGetSoundCategories();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [openedCategoryId, setOpenedCategoryId] = useState<number | null>(null);

  const sounds = useMemo(() => soundsData?.sounds ?? [], [soundsData?.sounds]);
  const hasSounds = sounds.length > 0;
  const categories = useMemo(
    () => categoriesData?.categories ?? createCategoriesFromSounds(sounds),
    [categoriesData?.categories, sounds],
  );
  const trimmedSearchKeyword = searchKeyword.trim();
  const isSearching = trimmedSearchKeyword.length > 0;

  const categorySoundGroups = useMemo<CategorySoundGroupTypes[]>(() => {
    const lowerSearchKeyword = trimmedSearchKeyword.toLowerCase();
    const filteredSounds = isSearching
      ? sounds.filter((sound) =>
          sound.name.toLowerCase().includes(lowerSearchKeyword),
        )
      : sounds;

    return categories
      .map((category) => ({
        category,
        sounds: filteredSounds.filter(
          (sound) => sound.category_id === category.category_id,
        ),
      }))
      .filter(({ sounds: groupSounds }) => !isSearching || groupSounds.length);
  }, [categories, isSearching, sounds, trimmedSearchKeyword]);

  const hasNoSearchResult = isSearching && categorySoundGroups.length === 0;

  const handleSearchKeywordChange = useCallback((keyword: string) => {
    setSearchKeyword(keyword);
  }, []);

  const handleCategoryToggleClick = useCallback((categoryId: number) => {
    setOpenedCategoryId((prevOpenedCategoryId) =>
      prevOpenedCategoryId === categoryId ? null : categoryId,
    );
  }, []);

  return {
    categorySoundGroups,
    hasNoSearchResult,
    // 소리 목록만 있으면 카테고리는 합성 폴백으로 대체되므로,
    // 소리가 없을 때에만 카테고리 에러/로딩을 섹션 차단 사유로 본다.
    isError: isSoundsError || (!hasSounds && isCategoriesError),
    isLoading: isSoundsLoading || (!hasSounds && isCategoriesLoading),
    isSearching,
    openedCategoryId,
    searchKeyword,
    handleCategoryToggleClick,
    handleSearchKeywordChange,
  };
};
