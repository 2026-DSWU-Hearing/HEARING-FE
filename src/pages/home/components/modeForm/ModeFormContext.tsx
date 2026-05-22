import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';

export type ModeFormPageTypes = 'create' | 'edit';

export interface ModeFormSubmitDataTypes {
  name: string;
  icon: string;
}

interface ModeFormProviderPropTypes {
  children: ReactNode;
  pageType: ModeFormPageTypes;
  initialName?: string;
  initialIcon?: string;
  errorMessage?: string;
  isSubmitting?: boolean;
  isDeleting?: boolean;
  onSubmit: (formData: ModeFormSubmitDataTypes) => void;
  onDelete?: () => void;
}

interface ModeFormContextTypes {
  modeName: string;
  selectedIcon: string;
  isEditPage: boolean;
  headerTitle: string;
  headerActionLabel: string;
  modeNameLabel: string;
  iconTitle: string;
  errorMessage?: string;
  isSubmitting: boolean;
  isDeleting: boolean;
  hasDeleteAction: boolean;
  handleModeNameChange: (name: string) => void;
  handleIconSelect: (icon: string) => void;
  handleSubmitClick: () => void;
  handleDeleteClick: () => void;
}

const DEFAULT_MODE_ICON = '집';

const ModeFormContext = createContext<ModeFormContextTypes | null>(null);

export const ModeFormProvider = ({
  children,
  pageType,
  initialName = '',
  initialIcon = DEFAULT_MODE_ICON,
  errorMessage,
  isSubmitting = false,
  isDeleting = false,
  onSubmit,
  onDelete,
}: ModeFormProviderPropTypes) => {
  const [modeName, setModeName] = useState(initialName);
  const [selectedIcon, setSelectedIcon] = useState(initialIcon);

  const isEditPage = pageType === 'edit';
  const headerTitle = isEditPage ? '모드 설정' : '새 모드 만들기';
  const headerActionLabel = isEditPage ? '완료' : '저장';
  const modeNameLabel = isEditPage ? '모드 이름 수정' : '모드 이름';
  const iconTitle = isEditPage ? '아이콘 수정' : '아이콘 선택';

  // 수정 페이지에서 상세 조회가 늦게 도착하면 초기값을 폼 상태에 다시 반영한다.
  useEffect(() => {
    setModeName(initialName);
  }, [initialName]);

  useEffect(() => {
    setSelectedIcon(initialIcon);
  }, [initialIcon]);

  const handleModeNameChange = useCallback((name: string) => {
    setModeName(name);
  }, []);

  const handleIconSelect = useCallback((icon: string) => {
    setSelectedIcon(icon);
  }, []);

  const handleSubmitClick = useCallback(() => {
    onSubmit({
      name: modeName,
      icon: selectedIcon,
    });
  }, [modeName, onSubmit, selectedIcon]);

  const handleDeleteClick = useCallback(() => {
    onDelete?.();
  }, [onDelete]);

  const contextValue = useMemo(
    () => ({
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
      hasDeleteAction: Boolean(onDelete),
      handleModeNameChange,
      handleIconSelect,
      handleSubmitClick,
      handleDeleteClick,
    }),
    [
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
      onDelete,
      handleModeNameChange,
      handleIconSelect,
      handleSubmitClick,
      handleDeleteClick,
    ],
  );

  return (
    <ModeFormContext.Provider value={contextValue}>
      {children}
    </ModeFormContext.Provider>
  );
};

export const useModeFormContext = () => {
  const context = useContext(ModeFormContext);

  if (!context) {
    throw new Error('useModeFormContext는 ModeFormProvider 안에서 사용해야 합니다');
  }

  return context;
};
