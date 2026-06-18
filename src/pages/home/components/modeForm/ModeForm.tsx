import ModeDeleteBtn from '@/pages/home/components/modeForm/ModeDeleteBtn';
import {
  MAX_MODE_NAME_LENGTH,
  ModeFormProvider,
  useModeFormContext,
} from '@/pages/home/components/modeForm/ModeFormContext';
import ModeHeader from '@/pages/home/components/modeForm/ModeHeader';
import ModeIconPicker from '@/pages/home/components/modeForm/ModeIconPicker';
import ModeSoundSelectSection from '@/pages/home/components/modeForm/ModeSoundSelectSection';
import { MODE_MESSAGE } from '@/pages/home/constants/modeMessages';
import TextInput from '@/shared/components/TextInput';
import type {
  ModeFormPageTypes,
  ModeFormSubmitDataTypes,
} from '@/pages/home/components/modeForm/ModeFormContext';

export interface ModeFormPropTypes {
  pageType: ModeFormPageTypes;
  initialName?: string;
  initialIcon?: string;
  currentModeId?: number;
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
    isSubmitting,
    isDeleting,
    hasDeleteAction,
    canSubmit,
    isModeNameTooLong,
    isModeNameDuplicated,
    hasSubmitted,
    handleModeNameChange,
    handleIconSelect,
    handleSubmitClick,
    handleDeleteClick,
  } = useModeFormContext();

  return (
    <div className="min-h-dvh pt-[2.75rem] px-[1.03rem] ">
      <ModeHeader
        title={headerTitle}
        actionLabel={headerActionLabel}
        onActionClick={handleSubmitClick}
        isActionDisabled={isSubmitting || !canSubmit}
      />

      <main>
        <TextInput
          label={modeNameLabel}
          value={modeName}
          placeholder="예: 주방"
          onChange={handleModeNameChange}
          maxLength={MAX_MODE_NAME_LENGTH}
          errorMessage={
            hasSubmitted
              ? undefined
              : isModeNameTooLong
                ? `모드 이름은 최대 ${MAX_MODE_NAME_LENGTH}글자까지 가능합니다`
                : isModeNameDuplicated
                  ? MODE_MESSAGE.DUPLICATED_NAME
                  : undefined
          }
        />

        <section>
          <h2 className="heading-base-semibold text-secondary mb-xs mt-[2rem]">
            {iconTitle}
          </h2>
          <p className="body-sm-regular text-secondary">
            선택한 아이콘이 모드 탭에 표시됩니다
          </p>
          <div className="mt-base">
            <ModeIconPicker
              selectedIcon={selectedIcon}
              onIconSelect={handleIconSelect}
            />
          </div>
        </section>

        {!isEditPage && <ModeSoundSelectSection />}

        {isEditPage && hasDeleteAction && (
          <div className="flex justify-center mt-[1.81rem]">
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
