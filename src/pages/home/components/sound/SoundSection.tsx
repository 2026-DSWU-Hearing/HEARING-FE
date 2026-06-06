import AddBtn from '@/pages/home/components/AddButton';
import SoundAddBottomModal from '@/pages/home/components/sound/SoundAddBottomModal';
import SoundCard from '@/pages/home/components/sound/SoundCard';
import { useSoundSection } from '@/pages/home/hooks/useSoundSection';

const SoundSection = () => {
  const {
    selectedModeId,
    sounds,
    isLoading,
    isError,
    isEditMode,
    isDoNotDisturb,
    isAddSoundModalOpen,
    selectedRemoveSoundIds,
    offSoundIds,
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
    <section>
      <div className="mb-[1.5rem] flex items-center justify-between">
        <h2 className="heading-base-semibold text-primary">담은 소리</h2>
        {isEditMode ? (
          <div className="flex gap-base">
            <button
              type="button"
              onClick={closeEditMode}
              className="body-base-regular text-secondary"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleRemoveSelectedSoundsClick}
              className="body-base-regular text-state-alert"
              disabled={selectedRemoveSoundIds.length === 0}
            >
              삭제
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={toggleEditMode}
            className="body-base-regular text-tertiary"
          >
            편집
          </button>
        )}
      </div>

      {isLoading && <p>소리를 불러오는 중입니다...</p>}
      {isError && <p>모드에 담긴 소리를 불러오지 못했습니다</p>}

      <div className="grid grid-cols-3 gap-base">
        {sounds.map((sound) => (
          <SoundCard
            key={sound.sound_id}
            soundId={sound.sound_id}
            name={sound.name}
            categoryName={sound.category}
            isDoNotDisturb={isDoNotDisturb}
            isEditMode={isEditMode}
            isChecked={selectedRemoveSoundIds.includes(sound.sound_id)}
            isOn={!offSoundIds.includes(sound.sound_id)}
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
