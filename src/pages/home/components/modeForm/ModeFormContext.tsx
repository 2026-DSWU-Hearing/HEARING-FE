import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { toggleSoundId } from '@/pages/home/utils/toggleSoundId';

export type ModeFormPageTypes = 'create' | 'edit';

export interface ModeFormSubmitDataTypes {
  name: string;
  icon: string;
  soundIds: number[];
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
  selectedSoundIds: number[];
  isEditPage: boolean;
  headerTitle: string;
  headerActionLabel: string;
  modeNameLabel: string;
  iconTitle: string;
  errorMessage?: string;
  isSubmitting: boolean;
  isDeleting: boolean;
  hasDeleteAction: boolean;
  canSubmit: boolean;
  isModeNameTooLong: boolean;
  handleModeNameChange: (name: string) => void;
  handleIconSelect: (icon: string) => void;
  handleSoundToggle: (soundId: number) => void;
  handleSubmitClick: () => void;
  handleDeleteClick: () => void;
}

const DEFAULT_MODE_ICON = '집';
export const MAX_MODE_NAME_LENGTH = 10;

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
  const [selectedSoundIds, setSelectedSoundIds] = useState<number[]>([]);

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

  const trimmedModeName = modeName.trim();
  const isModeNameTooLong = trimmedModeName.length > MAX_MODE_NAME_LENGTH;
  const isModeNameValid =
    trimmedModeName.length > 0 && !isModeNameTooLong;
  // 생성 페이지에서는 소리를 최소 1개 골라야 저장 버튼이 활성화된다.
  const canSubmit =
    isModeNameValid && (isEditPage || selectedSoundIds.length >= 1);

  const handleModeNameChange = useCallback((name: string) => {
    setModeName(name);
  }, []);

  const handleIconSelect = useCallback((icon: string) => {
    setSelectedIcon(icon);
  }, []);

  const handleSoundToggle = useCallback((soundId: number) => {
    setSelectedSoundIds((prevSelectedSoundIds) =>
      toggleSoundId(prevSelectedSoundIds, soundId),
    );
  }, []);

  const handleSubmitClick = useCallback(() => {
    onSubmit({
      name: modeName,
      icon: selectedIcon,
      soundIds: selectedSoundIds,
    });
  }, [modeName, onSubmit, selectedIcon, selectedSoundIds]);

  const handleDeleteClick = useCallback(() => {
    onDelete?.();
  }, [onDelete]);

  const contextValue = useMemo(
    () => ({
      modeName,
      selectedIcon,
      selectedSoundIds,
      isEditPage,
      headerTitle,
      headerActionLabel,
      modeNameLabel,
      iconTitle,
      errorMessage,
      isSubmitting,
      isDeleting,
      hasDeleteAction: Boolean(onDelete),
      canSubmit,
      isModeNameTooLong,
      handleModeNameChange,
      handleIconSelect,
      handleSoundToggle,
      handleSubmitClick,
      handleDeleteClick,
    }),
    [
      modeName,
      selectedIcon,
      selectedSoundIds,
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
      handleSoundToggle,
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
