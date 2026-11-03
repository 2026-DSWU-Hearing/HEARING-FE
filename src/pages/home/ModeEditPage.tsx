import ModeForm from '@/pages/home/components/modeForm/ModeForm';
import { MODE_MESSAGE } from '@/pages/home/constants/modeMessages';
import { useModeEditPage } from '@/pages/home/hooks/useModeEditPage';
import AlertModal from '@/shared/components/AlertModal';
import ConfirmModal from '@/shared/components/ConfirmModal';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import QueryErrorState from '@/shared/components/QueryErrorState';

const ModeEditPage = () => {
  const {
    modeDetailData,
    errorMessage,
    isValidModeId,
    isModeDetailLoading,
    isModeDetailError,
    isModeDetailFetching,
    isModesError,
    isModesFetching,
    handleDetailRetryClick,
    handleModesRetryClick,
    isUpdatingMode,
    isDeletingMode,
    isModesReady,
    isDeleteConfirmOpen,
    isActivateDeleteOpen,
    activeDeleteMessage,
    handleModeUpdateSubmit,
    handleModeDeleteClick,
    handleModeDeleteConfirm,
    handleActiveModeDeleteConfirm,
    closeDeleteConfirm,
    closeActivateDelete,
    clearErrorMessage,
  } = useModeEditPage();

  if (!isValidModeId) {
    return <div className="p-6">올바르지 않은 모드입니다</div>;
  }

  if (isModeDetailLoading) {
    return <LoadingSpinner />;
  }

  if (!modeDetailData) {
    return (
      <QueryErrorState
        message="모드 정보를 불러오지 못했습니다"
        isRetrying={isModeDetailFetching}
        onRetry={handleDetailRetryClick}
      />
    );
  }

  return (
    <>
      {isModeDetailError && (
        <QueryErrorState
          message="모드 정보를 갱신하지 못했습니다"
          isRetrying={isModeDetailFetching}
          onRetry={handleDetailRetryClick}
        />
      )}
      {isModesError && (
        <QueryErrorState
          message="모드 목록을 불러오지 못해 삭제할 수 없습니다"
          isRetrying={isModesFetching}
          onRetry={handleModesRetryClick}
        />
      )}
      <ModeForm
        pageType="edit"
        initialName={modeDetailData.name}
        initialIcon={modeDetailData.icon}
        currentModeId={modeDetailData.mode_id}
        isSubmitting={isUpdatingMode}
        isDeleting={isDeletingMode || !isModesReady}
        onSubmit={handleModeUpdateSubmit}
        onDelete={handleModeDeleteClick}
      />
      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        message={MODE_MESSAGE.DELETE_CONFIRM}
        onConfirm={handleModeDeleteConfirm}
        onCancel={() => {}}
        onClose={closeDeleteConfirm}
      />
      <ConfirmModal
        isOpen={isActivateDeleteOpen}
        message={activeDeleteMessage}
        onConfirm={handleActiveModeDeleteConfirm}
        onCancel={() => {}}
        onClose={closeActivateDelete}
      />
      <AlertModal
        isOpen={Boolean(errorMessage)}
        message={errorMessage}
        onClose={clearErrorMessage}
      />
    </>
  );
};

export default ModeEditPage;
