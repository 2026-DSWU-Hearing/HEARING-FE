import { useCallback } from 'react';
import { useDeleteModeSound } from '@/pages/home/hooks/useDeleteModeSound';
import { useGetModeDetail } from '@/pages/home/hooks/useGetModeDetail';
import { useHomeModeContext } from '@/pages/home/hooks/useHomeModeContext';
import { useModeSoundState } from '@/pages/home/hooks/useModeSoundState';
import { usePutModeSounds } from '@/pages/home/hooks/usePutModeSounds';
import type { ModeSoundInputTypes } from '@/pages/home/types/soundTypes';
import type { SoundListItemTypes } from '@/pages/home/types/soundTypes';

// 선택된 모드의 "담은 소리" 섹션 전체를 총괄하는 훅. 상세 조회 + 편집/모달 UI 상태 + 소리 추가/삭제 로직을 한곳에 모은다.
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
    toggleDoNotDisturb,
    toggleRemoveSound,
    resetRemoveSounds,
    toggleSoundOnOff,
  } = useModeSoundState();

  // 꺼진(OFF) 소리는 모드별로 따로 유지해 모드 전환 후에도 ON/OFF 상태를 보존한다.
  const offSoundIds =
    selectedModeId === null
      ? []
      : (state.offSoundIdsByMode[selectedModeId] ?? []);

  // 소리 카드 클릭 함수.
  // - 방해금지 모드: 전체 비활성이라 어떤 클릭도 막는다.
  // - 편집 모드: 삭제 대상 선택 토글.
  // - 평상시: 소리 ON/OFF 토글.
  const handleSoundCardClick = useCallback(
    (soundId: number) => {
      if (selectedModeId === null || state.isDoNotDisturb) return;

      if (state.isEditMode) {
        toggleRemoveSound(soundId);
        return;
      }

      toggleSoundOnOff(selectedModeId, soundId);
    },
    [
      selectedModeId,
      state.isDoNotDisturb,
      state.isEditMode,
      toggleSoundOnOff,
      toggleRemoveSound,
    ],
  );

  // 선택된 소리 삭제 함수 — 전용 엔드포인트로 선택된 각 소리를 1개씩 삭제한다.
  // (서버는 "모드당 소리 최소 1개" 규칙이 있어, 전부 지우려 하면 마지막 1개에서 422가 날 수 있다.)
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

  // 소리 추가 완료 함수 — 기존 소리와 새 소리의 합집합으로 전체 교체한다(PUT /modes/{id}/sounds).
  const handleAddSoundsComplete = useCallback(
    (selectedSounds: SoundListItemTypes[]) => {
      if (selectedModeId === null || !data) return;

      // 백엔드는 sounds: [{ sound_id, name? }] 객체 배열을 원한다.
      const currentSounds: ModeSoundInputTypes[] = data.sounds.map((sound) => ({
        sound_id: sound.sound_id,
        name: sound.name,
      }));
      const newSounds: ModeSoundInputTypes[] = selectedSounds.map((sound) => ({
        sound_id: sound.sound_id,
        name: sound.name,
      }));

      // 이미 담긴 소리와 새로 선택한 소리가 겹치면 sound_id 기준으로 한 번만 전송한다.
      const mergedBySoundId = new Map<number, ModeSoundInputTypes>();
      [...currentSounds, ...newSounds].forEach((sound) => {
        mergedBySoundId.set(sound.sound_id, sound);
      });

      putModeSounds({
        modeId: selectedModeId,
        soundsData: {
          sounds: [...mergedBySoundId.values()],
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
    isDoNotDisturb: state.isDoNotDisturb,
    isAddSoundModalOpen: state.isAddSoundModalOpen,
    selectedRemoveSoundIds: state.selectedRemoveSoundIds,
    offSoundIds,
    toggleEditMode,
    closeEditMode,
    toggleDoNotDisturb,
    openAddSoundModal,
    closeAddSoundModal,
    handleSoundCardClick,
    handleRemoveSelectedSoundsClick,
    handleAddSoundsComplete,
  };
};
