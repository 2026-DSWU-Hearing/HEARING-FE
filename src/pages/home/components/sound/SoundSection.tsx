import AddBtn from '@/pages/home/components/AddBtn';
import SoundAddBottomModal from '@/pages/home/components/sound/SoundAddBottomModal';
import SoundCard from '@/pages/home/components/sound/SoundCard';
import { useDeleteModeSound } from '@/pages/home/hooks/useDeleteModeSound';
import { useGetModeDetail } from '@/pages/home/hooks/useGetModeDetail';
import { useModeSoundState } from '@/pages/home/hooks/useModeSoundState';
import { usePutModeSounds } from '@/pages/home/hooks/usePutModeSounds';
import type { SoundTypes } from '@/pages/home/types/soundTypes';

interface SoundSectionPropTypes {
  selectedModeId: number | null;
}

const SoundSection = ({ selectedModeId }: SoundSectionPropTypes) => {
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

  const disabledSoundIds =
    selectedModeId === null
      ? []
      : (state.disabledSoundIdsByMode[selectedModeId] ?? []);

  const handleSoundCardClick = (soundId: number) => {
    if (selectedModeId === null) return;

    if (state.isEditMode) {
      toggleRemoveSound(soundId);
      return;
    }

    toggleDisabledSound(selectedModeId, soundId);
  };

  const handleRemoveSelectedSoundsClick = async () => {
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
  };

  const handleAddSoundsComplete = (selectedSounds: SoundTypes[]) => {
    if (selectedModeId === null || !data) return;

    const currentSounds = data.sounds.map((sound) => ({
      sound_id: sound.sound_id,
      name: sound.name,
    }));
    const newSounds = selectedSounds.map((sound) => ({
      sound_id: sound.sound_id,
      name: sound.name,
    }));
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
  };

  if (selectedModeId === null) {
    return <section className="mt-12">모드를 선택해주세요</section>;
  }

  return (
    <section className="mt-14">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold">담은 소리</h2>
        {state.isEditMode ? (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={closeEditMode}
              className="text-sm font-bold text-neutral-500"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleRemoveSelectedSoundsClick}
              className="text-sm font-bold text-neutral-900 disabled:text-neutral-300"
              disabled={state.selectedRemoveSoundIds.length === 0}
            >
              삭제
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={toggleEditMode}
            className="text-sm font-bold text-neutral-400"
          >
            편집
          </button>
        )}
      </div>

      {isLoading && <p>소리 목록을 불러오는 중...</p>}
      {isError && <p>모드에 담긴 소리를 불러오지 못했습니다</p>}

      <div className="grid grid-cols-3 gap-3">
        {data?.sounds.map((sound) => (
          <SoundCard
            key={sound.sound_id}
            sound={sound}
            isEditMode={state.isEditMode}
            isDisabled={disabledSoundIds.includes(sound.sound_id)}
            isSelected={state.selectedRemoveSoundIds.includes(sound.sound_id)}
            onClick={handleSoundCardClick}
          />
        ))}
      </div>

      <div className="mt-5 flex justify-center">
        <AddBtn label="소리 추가하기" onClick={openAddSoundModal} />
      </div>

      {state.isAddSoundModalOpen && (
        <SoundAddBottomModal
          onClose={closeAddSoundModal}
          onComplete={handleAddSoundsComplete}
        />
      )}
    </section>
  );
};

export default SoundSection;
