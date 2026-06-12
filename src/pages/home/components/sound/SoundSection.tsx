import AddBtn from '@/pages/home/components/AddButton';
import SoundAddBottomModal from '@/pages/home/components/sound/SoundAddBottomModal';
import SoundCard from '@/pages/home/components/sound/SoundCard';
import { MODE_MESSAGE } from '@/pages/home/constants/modeMessages';
import { useSoundSection } from '@/pages/home/hooks/useSoundSection';
import AlertModal from '@/shared/components/AlertModal';
import ConfirmModal from '@/shared/components/ConfirmModal';

const SoundSection = () => {
  const {
    selectedModeId,
    isDoNotDisturb,
    sounds,
    isLoading,
    isError,
    isEditMode,
    isAddSoundModalOpen,
    selectedRemoveSoundIds,
    isDeleteConfirmOpen,
    alertMessage,
    toggleEditMode,
    closeEditMode,
    openAddSoundModal,
    closeAddSoundModal,
    closeDeleteConfirm,
    clearAlertMessage,
    handleSoundCardClick,
    handleRemoveSelectedSoundsClick,
    handleRemoveSelectedSoundsConfirm,
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
              disabled={isDoNotDisturb || selectedRemoveSoundIds.length === 0}
            >
              삭제
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={toggleEditMode}
            className="body-base-regular text-tertiary"
            disabled={isDoNotDisturb}
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
            isActive={sound.is_active}
            isDoNotDisturb={isDoNotDisturb}
            isEditMode={isEditMode}
            isSelected={
              !isDoNotDisturb && selectedRemoveSoundIds.includes(sound.sound_id)
            }
            onClick={handleSoundCardClick}
          />
        ))}
      </div>

      <div className="mt-5 flex justify-center">
        <AddBtn
          label="소리 추가하기"
          onClick={openAddSoundModal}
          disabled={isDoNotDisturb}
          className={
            isDoNotDisturb ? 'cursor-not-allowed opacity-60' : undefined
          }
        />
      </div>

      {isAddSoundModalOpen && (
        <SoundAddBottomModal
          onClose={closeAddSoundModal}
          onComplete={handleAddSoundsComplete}
        />
      )}

      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        message={MODE_MESSAGE.DELETE_CONFIRM}
        onConfirm={handleRemoveSelectedSoundsConfirm}
        onCancel={() => {}}
        onClose={closeDeleteConfirm}
      />

      <AlertModal
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={clearAlertMessage}
      />
    </section>
  );
};

export default SoundSection;
