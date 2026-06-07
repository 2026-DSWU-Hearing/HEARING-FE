import { useCallback, useMemo, useState } from 'react';
import { useGetSounds } from '@/pages/home/hooks/useGetSounds';
import type { SoundTypes } from '@/pages/home/types/soundTypes';
import { toggleSoundId } from '@/pages/home/utils/toggleSoundId';

interface UseSoundAddModalParamTypes {
  onComplete: (sounds: SoundTypes[]) => void;
}

// 소리 추가 모달의 상태를 담당하는 훅. 검색어/카테고리로 소리를 필터링하고, 선택한 소리들을 완료 시 부모로 넘긴다.
export const useSoundAddModal = ({
  onComplete,
}: UseSoundAddModalParamTypes) => {
  const { data, isLoading, isError } = useGetSounds();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSoundIds, setSelectedSoundIds] = useState<number[]>([]);

  const filteredSounds = useMemo(() => {
    const sounds = data?.sounds ?? [];

    return sounds.filter((sound) => {
      const isMatchedKeyword = sound.name.includes(searchKeyword);
      const isMatchedCategory =
        selectedCategory === null || sound.category_name === selectedCategory;

      return isMatchedKeyword && isMatchedCategory;
    });
  }, [data?.sounds, searchKeyword, selectedCategory]);

  const handleSearchKeywordChange = useCallback((keyword: string) => {
    setSearchKeyword(keyword);
  }, []);

  const handleCategoryChange = useCallback((category: string | null) => {
    setSelectedCategory(category);
  }, []);

  const handleSoundSelect = useCallback((soundId: number) => {
    setSelectedSoundIds((prevSelectedSoundIds) =>
      toggleSoundId(prevSelectedSoundIds, soundId),
    );
  }, []);

  const handleCompleteClick = useCallback(() => {
    const selectedSounds =
      data?.sounds.filter((sound) =>
        selectedSoundIds.includes(sound.sound_id),
      ) ?? [];

    onComplete(selectedSounds);
  }, [data?.sounds, onComplete, selectedSoundIds]);

  return {
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
  };
};
