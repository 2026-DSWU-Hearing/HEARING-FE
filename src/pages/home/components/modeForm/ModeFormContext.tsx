import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { DEFAULT_MODE_ICON_KEY } from '@/shared/components/icons/modes/modeIconMap';
import { useGetModes } from '@/pages/home/hooks/useGetModes';
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
  // 수정 페이지에서 이름 중복 검사 시 자기 자신을 제외하기 위한 현재 모드 id
  currentModeId?: number;
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
  isSubmitting: boolean;
  isDeleting: boolean;
  hasDeleteAction: boolean;
  canSubmit: boolean;
  isModeNameTooLong: boolean;
  isModeNameDuplicated: boolean;
  hasSubmitted: boolean;
  handleModeNameChange: (name: string) => void;
  handleIconSelect: (icon: string) => void;
  handleSoundToggle: (soundId: number) => void;
  handleSubmitClick: () => void;
  handleDeleteClick: () => void;
}

export const MAX_MODE_NAME_LENGTH = 10;

const ModeFormContext = createContext<ModeFormContextTypes | null>(null);

// 모드 생성/수정 폼의 입력 상태(이름·아이콘·소리)와 파생 값(라벨, 제출 가능 여부)을 한곳에서 관리하는 Provider.
// 같은 ModeForm UI를 create/edit 두 페이지가 pageType만 바꿔 재사용한다.
export const ModeFormProvider = ({
  children,
  pageType,
  initialName = '',
  initialIcon = DEFAULT_MODE_ICON_KEY,
  currentModeId,
  isSubmitting = false,
  isDeleting = false,
  onSubmit,
  onDelete,
}: ModeFormProviderPropTypes) => {
  const [modeName, setModeName] = useState(initialName);
  const [selectedIcon, setSelectedIcon] = useState(initialIcon);
  const [selectedSoundIds, setSelectedSoundIds] = useState<number[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // 이름 중복 검사를 위해 기존 모드 목록을 가져온다. 두 페이지 훅과 같은 쿼리키라 캐시를 공유한다.
  const { data: modesData } = useGetModes();

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

  // 기존 모드와 같은 이름이면(대소문자·앞뒤 공백 무시) 중복으로 본다.
  // 수정 페이지에서는 currentModeId로 자기 자신을 제외한다.
  const isModeNameDuplicated = useMemo(() => {
    const normalizedName = trimmedModeName.toLowerCase();
    if (!normalizedName) return false;

    return (modesData?.modes ?? [])
      .filter((mode) => mode.mode_id !== currentModeId)
      .some((mode) => mode.name.trim().toLowerCase() === normalizedName);
  }, [trimmedModeName, modesData, currentModeId]);

  // 생성 페이지에서는 소리를 최소 1개 골라야 저장 버튼이 활성화된다.
  const canSubmit =
    isModeNameValid &&
    !isModeNameDuplicated &&
    (isEditPage || selectedSoundIds.length >= 1);

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
    setHasSubmitted(true);
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
      isSubmitting,
      isDeleting,
      hasDeleteAction: Boolean(onDelete),
      canSubmit,
      isModeNameTooLong,
      isModeNameDuplicated,
      hasSubmitted,
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
      isSubmitting,
      isDeleting,
      onDelete,
      canSubmit,
      isModeNameTooLong,
      isModeNameDuplicated,
      hasSubmitted,
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

// ModeFormProvider가 제공하는 폼 상태와 핸들러를 꺼내 쓰는 훅. Provider 밖에서 쓰면 에러를 던진다.
export const useModeFormContext = () => {
  const context = useContext(ModeFormContext);

  if (!context) {
    throw new Error('useModeFormContext는 ModeFormProvider 안에서 사용해야 합니다');
  }

  return context;
};
