import ModeForm from '@/pages/home/components/modeForm/ModeForm';
import { useModeEditPage } from '@/pages/home/hooks/useModeEditPage';

const ModeEditPage = () => {
  const {
    modeDetailData,
    errorMessage,
    isValidModeId,
    isModeDetailLoading,
    isModeDetailError,
    isUpdatingMode,
    isDeletingMode,
    handleModeUpdateSubmit,
    handleModeDeleteClick,
  } = useModeEditPage();

  if (!isValidModeId) {
    return <div className="p-6">올바르지 않은 모드입니다</div>;
  }

  if (isModeDetailLoading) {
    return <div className="p-6">모드 정보를 불러오는 중...</div>;
  }

  if (isModeDetailError || !modeDetailData) {
    return <div className="p-6">모드 정보를 불러오지 못했습니다</div>;
  }

  return (
    <ModeForm
      pageType="edit"
      initialName={modeDetailData.name}
      initialIcon={modeDetailData.icon}
      errorMessage={errorMessage}
      isSubmitting={isUpdatingMode}
      isDeleting={isDeletingMode}
      onSubmit={handleModeUpdateSubmit}
      onDelete={handleModeDeleteClick}
    />
  );
};

export default ModeEditPage;
