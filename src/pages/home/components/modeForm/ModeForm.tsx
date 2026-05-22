import { useEffect, useState } from 'react';
import Input from '@/pages/home/components/modeForm/Input';
import ModeDeleteBtn from '@/pages/home/components/modeForm/ModeDeleteBtn';
import ModeHeader from '@/pages/home/components/modeForm/ModeHeader';
import ModeIconPicker from '@/pages/home/components/modeForm/ModeIconPicker';

type ModeFormPageTypes = 'create' | 'edit';

interface ModeFormSubmitDataTypes {
  name: string;
  icon: string;
}

interface ModeFormPropTypes {
  pageType: ModeFormPageTypes;
  initialName?: string;
  initialIcon?: string;
  errorMessage?: string;
  isSubmitting?: boolean;
  isDeleting?: boolean;
  onSubmit: (formData: ModeFormSubmitDataTypes) => void;
  onDelete?: () => void;
}

const DEFAULT_MODE_ICON = '집';

const ModeForm = ({
  pageType,
  initialName = '',
  initialIcon = DEFAULT_MODE_ICON,
  errorMessage,
  isSubmitting = false,
  isDeleting = false,
  onSubmit,
  onDelete,
}: ModeFormPropTypes) => {
  const [modeName, setModeName] = useState(initialName);
  const [selectedIcon, setSelectedIcon] = useState(initialIcon);

  const isEditPage = pageType === 'edit';
  const headerTitle = isEditPage ? '모드 설정' : '새 모드 만들기';
  const headerActionLabel = isEditPage ? '완료' : '저장';
  const modeNameLabel = isEditPage ? '모드 이름 수정' : '모드 이름';
  const iconTitle = isEditPage ? '아이콘 수정' : '아이콘 선택';

  useEffect(() => {
    setModeName(initialName);
  }, [initialName]);

  useEffect(() => {
    setSelectedIcon(initialIcon);
  }, [initialIcon]);

  const handleSubmitClick = () => {
    onSubmit({
      name: modeName,
      icon: selectedIcon,
    });
  };

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
          onChange={setModeName}
        />

        <section>
          <h2 className="text-xl font-bold">{iconTitle}</h2>
          <p className="mt-2 text-sm font-bold text-neutral-400">
            선택한 아이콘이 모드 탭에 표시됩니다
          </p>
          <div className="mt-6">
            <ModeIconPicker
              selectedIcon={selectedIcon}
              onIconSelect={setSelectedIcon}
            />
          </div>
        </section>

        {errorMessage && (
          <p className="text-center text-sm font-bold text-red-500">
            {errorMessage}
          </p>
        )}

        {isEditPage && onDelete && (
          <div className="flex justify-center">
            <ModeDeleteBtn onClick={onDelete} disabled={isDeleting} />
          </div>
        )}
      </main>
    </div>
  );
};

export default ModeForm;
