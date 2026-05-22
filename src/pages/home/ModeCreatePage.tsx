import ModeForm from '@/pages/home/components/modeForm/ModeForm';
import { useModeCreatePage } from '@/pages/home/hooks/useModeCreatePage';

const ModeCreatePage = () => {
  const { errorMessage, isCreatingMode, handleModeCreateSubmit } =
    useModeCreatePage();

  return (
    <ModeForm
      pageType="create"
      errorMessage={errorMessage}
      isSubmitting={isCreatingMode}
      onSubmit={handleModeCreateSubmit}
    />
  );
};

export default ModeCreatePage;
