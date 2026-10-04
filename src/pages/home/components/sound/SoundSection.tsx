import AddBtn from '@/pages/home/components/AddButton';
import SoundAddBottomModal from '@/pages/home/components/sound/SoundAddBottomModal';
import SoundCard from '@/pages/home/components/sound/SoundCard';
import SoundCardSkeleton from '@/pages/home/components/sound/SoundCardSkeleton';
import { MODE_MESSAGE } from '@/pages/home/constants/modeMessages';
import { useHomeModeContext } from '@/pages/home/hooks/useHomeModeContext';
import { useSoundSection } from '@/pages/home/hooks/useSoundSection';
import AlertModal from '@/shared/components/AlertModal';
import ConfirmModal from '@/shared/components/ConfirmModal';
import { AnimatePresence } from 'motion/react';

const SKELETON_SOUND_COUNT = 6;

// 선택된 모드의 소리 목록과 편집/추가 UI. 편집 모드·선택 목록·모달은 이 컴포넌트의 로컬 상태다.
const SoundSectionContent = () => {
  const {
    isDoNotDisturb,
    sounds,
    isLoading,
    isError,
    isSoundListUpdating,
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
              disabled={
                isDoNotDisturb ||
                isSoundListUpdating ||
                selectedRemoveSoundIds.length === 0
              }
            >
              삭제
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={toggleEditMode}
            className="body-base-regular text-tertiary"
            disabled={isDoNotDisturb || isSoundListUpdating}
          >
            편집
          </button>
        )}
      </div>

      {isError && <p>모드에 담긴 소리를 불러오지 못했습니다</p>}

      <div className="grid grid-cols-3 gap-3">
        {isLoading
          ? Array.from({ length: SKELETON_SOUND_COUNT }).map((_, index) => (
              <SoundCardSkeleton key={index} />
            ))
          : sounds.map((sound) => (
              <SoundCard
                key={sound.sound_id}
                sound={sound}
                isActive={sound.is_active}
                isDoNotDisturb={isDoNotDisturb}
                isEditMode={isEditMode}
                isSelected={
                  !isDoNotDisturb &&
                  selectedRemoveSoundIds.includes(sound.sound_id)
                }
                onClick={handleSoundCardClick}
              />
            ))}
      </div>

      <div className="mt-5 flex justify-center">
        <AddBtn
          label="소리 추가하기"
          onClick={openAddSoundModal}
          disabled={isDoNotDisturb || isSoundListUpdating}
          className={
            isDoNotDisturb || isSoundListUpdating
              ? 'cursor-not-allowed opacity-60'
              : undefined
          }
        />
      </div>

      <AnimatePresence>
        {isAddSoundModalOpen && (
          <SoundAddBottomModal
            onClose={closeAddSoundModal}
            onComplete={handleAddSoundsComplete}
          />
        )}
      </AnimatePresence>

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

// 모드가 바뀌면 key로 리마운트해 편집 모드·삭제 선택·모달·안내를 한 번에 초기화한다.
// (effect로 상태를 동기화하면 한 렌더 늦게 반응하고 이전 모드의 선택이 새 모드로 이어질 수 있다)
const SoundSection = () => {
  const { selectedModeId } = useHomeModeContext();

  if (selectedModeId === null) {
    return <section className="mt-12">모드를 선택해주세요</section>;
  }

  return <SoundSectionContent key={selectedModeId} />;
};

export default SoundSection;
