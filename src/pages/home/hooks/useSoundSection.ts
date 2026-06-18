import { useCallback, useState } from 'react';
import { MODE_MESSAGE } from '@/pages/home/constants/modeMessages';
import { useDeleteModeSound } from '@/pages/home/hooks/useDeleteModeSound';
import { useGetModeDetail } from '@/pages/home/hooks/useGetModeDetail';
import { useHomeModeContext } from '@/pages/home/hooks/useHomeModeContext';
import { useModeSoundState } from '@/pages/home/hooks/useModeSoundState';
import { usePatchModeSoundActive } from '@/pages/home/hooks/usePatchModeSoundActive';
import { usePutModeSounds } from '@/pages/home/hooks/usePutModeSounds';
import type { SoundTypes } from '@/pages/home/types/soundTypes';
import { useModal } from '@/shared/hooks/useModal';

// 선택된 모드의 "담은 소리" 섹션 전체를 총괄하는 훅. 상세 조회 + 편집/모달 UI 상태 + 소리 추가/삭제 로직을 한곳에 모은다.
export const useSoundSection = () => {
  const { selectedModeId, isDoNotDisturb } = useHomeModeContext();
  const { data, isLoading, isError } = useGetModeDetail(selectedModeId);
  const { mutateAsync: deleteModeSound } = useDeleteModeSound();
  const { mutate: patchModeSoundActive, isPending: isPatchModeSoundActivePending } =
    usePatchModeSoundActive();
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
  // 소리 삭제 확인 모달과, 최소 개수 위반 시 띄우는 안내 메시지 상태
  const deleteConfirmModal = useModal();
  const [alertMessage, setAlertMessage] = useState('');

  // 소리 카드 클릭 함수
  const handleSoundCardClick = useCallback(
    (soundId: number) => {
      if (selectedModeId === null || isDoNotDisturb) return;

      if (state.isEditMode) {
        toggleRemoveSound(soundId);
        return;
      }

      // on/off PATCH가 진행 중이면 연타로 인한 중복 요청을 막는다.
      if (isPatchModeSoundActivePending) return;

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
      isPatchModeSoundActivePending,
      patchModeSoundActive,
      selectedModeId,
      state.isEditMode,
      toggleRemoveSound,
    ],
  );

  // 삭제 버튼 클릭: 가드 검사 후 확인 모달을 연다(실제 삭제는 confirm에서).
  const handleRemoveSelectedSoundsClick = useCallback(() => {
    if (
      selectedModeId === null ||
      isDoNotDisturb ||
      state.selectedRemoveSoundIds.length === 0
    ) {
      return;
    }

    // 담긴 소리를 전부 지우려 하면 모드에 소리가 0개가 되므로 차단한다(최소 1개 유지).
    if (
      state.selectedRemoveSoundIds.length >= (data?.sounds.length ?? 0)
    ) {
      setAlertMessage(MODE_MESSAGE.MIN_SOUND_COUNT);
      return;
    }

    deleteConfirmModal.open();
  }, [
    data?.sounds.length,
    deleteConfirmModal,
    isDoNotDisturb,
    selectedModeId,
    state.selectedRemoveSoundIds,
  ]);

  // 확인 모달에서 "확인"을 눌렀을 때 실제 삭제를 수행한다.
  const handleRemoveSelectedSoundsConfirm = useCallback(async () => {
    if (selectedModeId === null) return;

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

  const clearAlertMessage = useCallback(() => setAlertMessage(''), []);

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
    isDeleteConfirmOpen: deleteConfirmModal.isOpen,
    alertMessage,
    toggleEditMode,
    closeEditMode,
    openAddSoundModal,
    closeAddSoundModal,
    closeDeleteConfirm: deleteConfirmModal.close,
    clearAlertMessage,
    handleSoundCardClick,
    handleRemoveSelectedSoundsClick,
    handleRemoveSelectedSoundsConfirm,
    handleAddSoundsComplete,
  };
};
