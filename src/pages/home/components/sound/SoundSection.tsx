import AddBtn from '@/pages/home/components/AddBtn';
import SoundAddBottomModal from '@/pages/home/components/sound/SoundAddBottomModal';
import SoundCard from '@/pages/home/components/sound/SoundCard';
import { useSoundSection } from '@/pages/home/hooks/useSoundSection';
import LoadingSpinner from '@/shared/components/LoadingSpinner';

const SoundSection = () => {
  const {
    selectedModeId,
    sounds,
    isLoading,
    isError,
    isEditMode,
    isAddSoundModalOpen,
    selectedRemoveSoundIds,
    disabledSoundIds,
    toggleEditMode,
    closeEditMode,
    openAddSoundModal,
    closeAddSoundModal,
    handleSoundCardClick,
    handleRemoveSelectedSoundsClick,
    handleAddSoundsComplete,
  } = useSoundSection();

  if (selectedModeId === null) {
    return <section className="mt-12">모드를 선택해주세요</section>;
  }

  return (
    <section className="mt-14">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold">담은 소리</h2>
        {isEditMode ? (
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
              disabled={selectedRemoveSoundIds.length === 0}
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

      {isLoading && <p>소리를 불러오는 중입니다...</p>}
      {isError && <p>모드에 담긴 소리를 불러오지 못했습니다</p>}

      <div className="grid grid-cols-3 gap-3">
        {sounds.map((sound) => (
          <SoundCard
            key={sound.sound_id}
            sound={sound}
            isEditMode={isEditMode}
            isDisabled={disabledSoundIds.includes(sound.sound_id)}
            isSelected={selectedRemoveSoundIds.includes(sound.sound_id)}
            onClick={handleSoundCardClick}
          />
        ))}
      </div>

      <div className="mt-5 flex justify-center">
        <AddBtn label="소리 추가하기" onClick={openAddSoundModal} />
      </div>

      {isAddSoundModalOpen && (
        <SoundAddBottomModal
          onClose={closeAddSoundModal}
          onComplete={handleAddSoundsComplete}
        />
      )}
    </section>
  );
};

export default SoundSection;
