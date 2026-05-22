import Input from '@/pages/home/components/modeForm/Input';
import ModeDeleteBtn from '@/pages/home/components/modeForm/ModeDeleteBtn';
import {
  ModeFormProvider,
  useModeFormContext,
} from '@/pages/home/components/modeForm/ModeFormContext';
import ModeHeader from '@/pages/home/components/modeForm/ModeHeader';
import ModeIconPicker from '@/pages/home/components/modeForm/ModeIconPicker';
import type {
  ModeFormPageTypes,
  ModeFormSubmitDataTypes,
} from '@/pages/home/components/modeForm/ModeFormContext';

export interface ModeFormPropTypes {
  pageType: ModeFormPageTypes;
  initialName?: string;
  initialIcon?: string;
  errorMessage?: string;
  isSubmitting?: boolean;
  isDeleting?: boolean;
  onSubmit: (formData: ModeFormSubmitDataTypes) => void;
  onDelete?: () => void;
}

const ModeFormContent = () => {
  const {
    modeName,
    selectedIcon,
    isEditPage,
    headerTitle,
    headerActionLabel,
    modeNameLabel,
    iconTitle,
    errorMessage,
    isSubmitting,
    isDeleting,
    hasDeleteAction,
    handleModeNameChange,
    handleIconSelect,
    handleSubmitClick,
    handleDeleteClick,
  } = useModeFormContext();

  return (
    <div className="min-h-dvh px-6 py-8">
      <ModeHeader
        title={headerTitle}
        actionLabel={headerActionLabel}
        onActionClick={handleSubmitClick}
        isActionDisabled={isSubmitting}
      />

      <main className="space-y-16">
        <Input
          label={modeNameLabel}
          value={modeName}
          placeholder="예: 주방"
          onChange={handleModeNameChange}
        />

        <section>
          <h2 className="text-xl font-bold">{iconTitle}</h2>
          <p className="mt-2 text-sm font-bold text-neutral-400">
            선택한 아이콘이 모드 탭에 표시됩니다
          </p>
          <div className="mt-6">
            <ModeIconPicker
              selectedIcon={selectedIcon}
              onIconSelect={handleIconSelect}
            />
          </div>
        </section>

        {errorMessage && (
          <p className="text-center text-sm font-bold text-red-500">
            {errorMessage}
          </p>
        )}

        {isEditPage && hasDeleteAction && (
          <div className="flex justify-center">
            <ModeDeleteBtn onClick={handleDeleteClick} disabled={isDeleting} />
          </div>
        )}
      </main>
    </div>
  );
};

const ModeForm = (props: ModeFormPropTypes) => {
  return (
    <ModeFormProvider {...props}>
      <ModeFormContent />
    </ModeFormProvider>
  );
};

export default ModeForm;
