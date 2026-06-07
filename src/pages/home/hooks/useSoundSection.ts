import { useCallback } from 'react';
import { useDeleteModeSound } from '@/pages/home/hooks/useDeleteModeSound';
import { useGetModeDetail } from '@/pages/home/hooks/useGetModeDetail';
import { useHomeModeContext } from '@/pages/home/hooks/useHomeModeContext';
import { useModeSoundState } from '@/pages/home/hooks/useModeSoundState';
import { usePatchModeSoundActive } from '@/pages/home/hooks/usePatchModeSoundActive';
import { usePutModeSounds } from '@/pages/home/hooks/usePutModeSounds';
import type { SoundTypes } from '@/pages/home/types/soundTypes';

// 선택된 모드의 "담은 소리" 섹션 전체를 총괄하는 훅. 상세 조회 + 편집/모달 UI 상태 + 소리 추가/삭제 로직을 한곳에 모은다.
export const useSoundSection = () => {
  const { selectedModeId, isDoNotDisturb } = useHomeModeContext();
  const { data, isLoading, isError } = useGetModeDetail(selectedModeId);
  const { mutateAsync: deleteModeSound } = useDeleteModeSound();
  const { mutate: patchModeSoundActive } = usePatchModeSoundActive();
  const { mutate: putModeSounds } = usePutModeSounds();
  const {
    state,
    toggleEditMode,
    closeEditMode,
    openAddSoundModal,
    closeAddSoundModal,
    toggleRemoveSound,
    resetRemoveSounds,
  } = useModeSoundState();

  // 소리 카드 클릭 함수
  const handleSoundCardClick = useCallback(
    (soundId: number) => {
      if (selectedModeId === null || isDoNotDisturb) return;

      if (state.isEditMode) {
        toggleRemoveSound(soundId);
        return;
      }

      const selectedSound = data?.sounds.find(
        (sound) => sound.sound_id === soundId,
      );
      if (!selectedSound) return;

      patchModeSoundActive({
        modeId: selectedModeId,
        soundId,
        isActive: !selectedSound.is_active,
      });
    },
    [
      data?.sounds,
      isDoNotDisturb,
      patchModeSoundActive,
      selectedModeId,
      state.isEditMode,
      toggleRemoveSound,
    ],
  );

  // 선택된 소리 삭제 함수
  const handleRemoveSelectedSoundsClick = useCallback(async () => {
    if (
      selectedModeId === null ||
      isDoNotDisturb ||
      state.selectedRemoveSoundIds.length === 0
    ) {
      return;
    }

    await Promise.all(
      state.selectedRemoveSoundIds.map((soundId) =>
        deleteModeSound({ modeId: selectedModeId, soundId }),
      ),
    );

    resetRemoveSounds();
    closeEditMode();
  }, [
    closeEditMode,
    deleteModeSound,
    isDoNotDisturb,
    resetRemoveSounds,
    selectedModeId,
    state.selectedRemoveSoundIds,
  ]);

  // 소리 추가 완료 함수
  const handleAddSoundsComplete = useCallback(
    (selectedSounds: SoundTypes[]) => {
      if (selectedModeId === null || isDoNotDisturb || !data) return;

      const currentSounds = data.sounds.map((sound) => ({
        sound_id: sound.sound_id,
        name: sound.name,
      }));
      const newSounds = selectedSounds.map((sound) => ({
        sound_id: sound.sound_id,
        name: sound.name,
      }));
      // 이미 담긴 소리와 새로 선택한 소리가 겹치면 한 번만 전송한다.
      const nextSounds = [...currentSounds, ...newSounds].filter(
        (sound, index, sounds) =>
          sounds.findIndex((item) => item.sound_id === sound.sound_id) ===
          index,
      );

      putModeSounds({
        modeId: selectedModeId,
        soundsData: {
          sounds: nextSounds,
        },
      });
      closeAddSoundModal();
    },
    [closeAddSoundModal, data, isDoNotDisturb, putModeSounds, selectedModeId],
  );

  return {
    selectedModeId,
    isDoNotDisturb,
    sounds: data?.sounds ?? [],
    isLoading,
    isError,
    isEditMode: state.isEditMode,
    isAddSoundModalOpen: state.isAddSoundModalOpen,
    selectedRemoveSoundIds: state.selectedRemoveSoundIds,
    toggleEditMode,
    closeEditMode,
    openAddSoundModal,
    closeAddSoundModal,
    handleSoundCardClick,
    handleRemoveSelectedSoundsClick,
    handleAddSoundsComplete,
  };
};
