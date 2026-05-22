import { useCallback } from 'react';
import { useDeleteModeSound } from '@/pages/home/hooks/useDeleteModeSound';
import { useGetModeDetail } from '@/pages/home/hooks/useGetModeDetail';
import { useHomeModeContext } from '@/pages/home/hooks/useHomeModeContext';
import { useModeSoundState } from '@/pages/home/hooks/useModeSoundState';
import { usePutModeSounds } from '@/pages/home/hooks/usePutModeSounds';
import type { SoundTypes } from '@/pages/home/types/soundTypes';

export const useSoundSection = () => {
  const { selectedModeId } = useHomeModeContext();
  const { data, isLoading, isError } = useGetModeDetail(selectedModeId);
  const { mutateAsync: deleteModeSound } = useDeleteModeSound();
  const { mutate: putModeSounds } = usePutModeSounds();
  const {
    state,
    toggleEditMode,
    closeEditMode,
    openAddSoundModal,
    closeAddSoundModal,
    toggleRemoveSound,
    resetRemoveSounds,
    toggleDisabledSound,
  } = useModeSoundState();

  // 비활성 표시는 모드별로 따로 유지해 모드 전환 후에도 UI 선택을 보존한다.
  const disabledSoundIds =
    selectedModeId === null
      ? []
      : (state.disabledSoundIdsByMode[selectedModeId] ?? []);

  const handleSoundCardClick = useCallback(
    (soundId: number) => {
      if (selectedModeId === null) return;

      if (state.isEditMode) {
        toggleRemoveSound(soundId);
        return;
      }

      toggleDisabledSound(selectedModeId, soundId);
    },
    [
      selectedModeId,
      state.isEditMode,
      toggleDisabledSound,
      toggleRemoveSound,
    ],
  );

  const handleRemoveSelectedSoundsClick = useCallback(async () => {
    if (selectedModeId === null || state.selectedRemoveSoundIds.length === 0) {
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
    resetRemoveSounds,
    selectedModeId,
    state.selectedRemoveSoundIds,
  ]);

  const handleAddSoundsComplete = useCallback(
    (selectedSounds: SoundTypes[]) => {
      if (selectedModeId === null || !data) return;

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
          sounds.findIndex((item) => item.sound_id === sound.sound_id) === index,
      );

      putModeSounds({
        modeId: selectedModeId,
        soundsData: {
          sounds: nextSounds,
        },
      });
      closeAddSoundModal();
    },
    [closeAddSoundModal, data, putModeSounds, selectedModeId],
  );

  return {
    selectedModeId,
    sounds: data?.sounds ?? [],
    isLoading,
    isError,
    isEditMode: state.isEditMode,
    isAddSoundModalOpen: state.isAddSoundModalOpen,
    selectedRemoveSoundIds: state.selectedRemoveSoundIds,
    disabledSoundIds,
    toggleEditMode,
    closeEditMode,
    openAddSoundModal,
    closeAddSoundModal,
    handleSoundCardClick,
    handleRemoveSelectedSoundsClick,
    handleAddSoundsComplete,
  };
};
