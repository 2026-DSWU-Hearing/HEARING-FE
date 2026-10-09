import { useCallback, useState } from 'react';
import {
  HOME_ERROR_MESSAGE,
  MODE_MESSAGE,
} from '@/pages/home/constants/modeMessages';
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
  const { mutate: patchModeSoundActive, isPending: isPatchModeSoundActivePending } =
    usePatchModeSoundActive();
  // 추가·삭제는 둘 다 "남길 소리 전체"를 PUT한다. 앞 요청이 끝나기 전에 다음 요청을 보내면
  // 아직 반영 안 된 캐시로 목록을 만들어 앞선 변경을 덮어쓰므로, 진행 중에는 목록 조작을 막는다.
  const { mutate: putModeSounds, isPending: isSoundListUpdating } =
    usePutModeSounds();
  const {
    state,
    toggleEditMode,
    closeEditMode,
    openAddSoundModal: openAddSoundModalState,
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

      patchModeSoundActive(
        {
          modeId: selectedModeId,
          soundId,
          isActive: !selectedSound.is_active,
        },
        {
          onError: () => setAlertMessage(HOME_ERROR_MESSAGE.TOGGLE_SOUND),
        },
      );
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
  // 삭제 = "빼기"가 아니라 삭제 대상을 제외한 "남길 소리"만 모아 한 번에 PUT하는 방식.
  // 추가(handleAddSoundsComplete)와 동일한 mutation/캐시 경로를 공유한다.
  // 편집 모드·선택 목록은 성공했을 때만 닫는다. 실패하면 그대로 남아 바로 다시 시도할 수 있다.
  const handleRemoveSelectedSoundsConfirm = useCallback(() => {
    if (selectedModeId === null || !data || isSoundListUpdating) return;

    const nextSounds = data.sounds
      .filter(
        (sound) => !state.selectedRemoveSoundIds.includes(sound.sound_id),
      )
      .map((sound) => ({ sound_id: sound.sound_id, name: sound.name }));

    putModeSounds(
      {
        modeId: selectedModeId,
        soundsData: {
          sounds: nextSounds,
        },
      },
      {
        onSuccess: () => {
          resetRemoveSounds();
          closeEditMode();
        },
        onError: () => setAlertMessage(HOME_ERROR_MESSAGE.REMOVE_SOUND),
      },
    );
  }, [
    closeEditMode,
    data,
    isSoundListUpdating,
    putModeSounds,
    resetRemoveSounds,
    selectedModeId,
    state.selectedRemoveSoundIds,
  ]);

  const clearAlertMessage = useCallback(() => setAlertMessage(''), []);

  // 소리 추가 모달 열기. 목록 갱신 중에는 열지 않는다(앞선 변경을 덮어쓰는 요청 방지).
  const openAddSoundModal = useCallback(() => {
    if (isSoundListUpdating) return;

    openAddSoundModalState();
  }, [isSoundListUpdating, openAddSoundModalState]);

  // 소리 추가 완료 함수. 모달은 성공했을 때만 닫고, 실패하면 선택을 유지한 채 안내한다.
  const handleAddSoundsComplete = useCallback(
    (selectedSounds: SoundTypes[]) => {
      if (
        selectedModeId === null ||
        isDoNotDisturb ||
        !data ||
        isSoundListUpdating
      ) {
        return;
      }

      // 아무것도 고르지 않고 완료하면 바꿀 것이 없으므로 요청 없이 닫는다.
      if (selectedSounds.length === 0) {
        closeAddSoundModal();
        return;
      }

      const currentSounds = data.sounds.map((sound) => ({
        sound_id: sound.sound_id,
        name: sound.name,
      }));
      const currentSoundIds = new Set(
        currentSounds.map((sound) => sound.sound_id),
      );
      // 이미 담긴 소리는 제외한다. 전부 겹치면 요청 없이 안내만 띄우고 모달은 유지한다.
      const newSounds = selectedSounds
        .filter((sound) => !currentSoundIds.has(sound.sound_id))
        .map((sound) => ({ sound_id: sound.sound_id, name: sound.name }));
      const hasDuplicatedSound = newSounds.length < selectedSounds.length;

      if (newSounds.length === 0) {
        setAlertMessage(MODE_MESSAGE.ALREADY_ADDED_SOUND);
        return;
      }

      putModeSounds(
        {
          modeId: selectedModeId,
          soundsData: {
            sounds: [...currentSounds, ...newSounds],
          },
        },
        {
          onSuccess: () => {
            closeAddSoundModal();
            // 일부만 겹친 경우: 나머지는 추가됐고 겹친 소리는 빠졌음을 알린다.
            if (hasDuplicatedSound) {
              setAlertMessage(MODE_MESSAGE.PARTIALLY_ALREADY_ADDED_SOUND);
            }
          },
          onError: () => setAlertMessage(HOME_ERROR_MESSAGE.ADD_SOUND),
        },
      );
    },
    [
      closeAddSoundModal,
      data,
      isDoNotDisturb,
      isSoundListUpdating,
      putModeSounds,
      selectedModeId,
    ],
  );

  return {
    selectedModeId,
    isDoNotDisturb,
    sounds: data?.sounds ?? [],
    isLoading,
    isError,
    isSoundListUpdating,
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
