import ModeForm from '@/pages/home/components/modeForm/ModeForm';
import { useModeCreatePage } from '@/pages/home/hooks/useModeCreatePage';
import AlertModal from '@/shared/components/AlertModal';

const ModeCreatePage = () => {
  const {
    errorMessage,
    isCreatingMode,
    handleModeCreateSubmit,
    clearErrorMessage,
  } = useModeCreatePage();

  return (
    <>
      <ModeForm
        pageType="create"
        isSubmitting={isCreatingMode}
        onSubmit={handleModeCreateSubmit}
      />
      <AlertModal
        isOpen={Boolean(errorMessage)}
        message={errorMessage}
        onClose={clearErrorMessage}
      />
    </>
  );
};

export default ModeCreatePage;
