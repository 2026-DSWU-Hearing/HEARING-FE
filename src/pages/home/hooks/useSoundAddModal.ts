import { useCallback, useMemo, useState } from 'react';
import { useGetSounds } from '@/pages/home/hooks/useGetSounds';
import type { SoundTypes } from '@/pages/home/types/soundTypes';
import { toggleSoundId } from '@/pages/home/utils/toggleSoundId';
import { useModal } from '@/shared/hooks/useModal';

interface UseSoundAddModalParamTypes {
  onComplete: (sounds: SoundTypes[]) => void;
  onClose: () => void;
}

// 소리 추가 모달의 상태를 담당하는 훅. 검색어/카테고리로 소리를 필터링하고, 선택한 소리들을 완료 시 부모로 넘긴다.
export const useSoundAddModal = ({
  onComplete,
  onClose,
}: UseSoundAddModalParamTypes) => {
  const { data, isLoading, isError } = useGetSounds();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSoundIds, setSelectedSoundIds] = useState<number[]>([]);
  // 선택한 채로 닫으려 할 때 띄우는 "취소 확인" 모달 상태
  const cancelConfirmModal = useModal();

  const filteredSounds = useMemo(() => {
    const sounds = data?.sounds ?? [];

    return sounds.filter((sound) => {
      const isMatchedKeyword = sound.name.includes(searchKeyword);
      const isMatchedCategory =
        selectedCategory === null || sound.category_name === selectedCategory;

      return isMatchedKeyword && isMatchedCategory;
    });
  }, [data?.sounds, searchKeyword, selectedCategory]);
  const hasNoSearchResult =
    searchKeyword.trim().length > 0 && filteredSounds.length === 0;

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

  // X(닫기) 클릭: 선택한 소리가 있으면 취소 확인 모달을 먼저 띄우고, 없으면 즉시 닫는다.
  const handleCloseClick = useCallback(() => {
    if (selectedSoundIds.length > 0) {
      cancelConfirmModal.open();
      return;
    }

    onClose();
  }, [cancelConfirmModal, onClose, selectedSoundIds]);

  // 취소 확인 모달에서 "확인"을 눌렀을 때: 선택 내용을 버리고 모달을 닫는다.
  const handleCancelConfirm = useCallback(() => {
    onClose();
  }, [onClose]);

  return {
    searchKeyword,
    selectedCategory,
    selectedSoundIds,
    filteredSounds,
    hasNoSearchResult,
    isLoading,
    isError,
    isCancelConfirmOpen: cancelConfirmModal.isOpen,
    closeCancelConfirm: cancelConfirmModal.close,
    handleSearchKeywordChange,
    handleCategoryChange,
    handleSoundSelect,
    handleCompleteClick,
    handleCloseClick,
    handleCancelConfirm,
  };
};
