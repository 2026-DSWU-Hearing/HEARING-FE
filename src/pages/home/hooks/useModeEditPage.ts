import { useEffect, useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import type { ModeFormSubmitDataTypes } from '@/pages/home/components/modeForm/ModeFormContext';
import { MAX_MODE_NAME_LENGTH } from '@/pages/home/components/modeForm/ModeFormContext';
import {
  MODE_EDIT_ERROR_MESSAGE,
  MODE_MESSAGE,
} from '@/pages/home/constants/modeMessages';
import { useDeleteMode } from '@/pages/home/hooks/useDeleteMode';
import { useGetModeDetail } from '@/pages/home/hooks/useGetModeDetail';
import { useGetModes } from '@/pages/home/hooks/useGetModes';
import { usePatchActivateMode } from '@/pages/home/hooks/usePatchActivateMode';
import { usePutMode } from '@/pages/home/hooks/usePutMode';
import { useModal } from '@/shared/hooks/useModal';

// 에러 메시지 변환
const getModeEditErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    if (error.response?.status === 400) {
      return MODE_EDIT_ERROR_MESSAGE.BAD_REQUEST;
    }

    if (error.response?.status === 404) {
      return MODE_EDIT_ERROR_MESSAGE.NOT_FOUND;
    }

    if (error.response?.status === 409) {
      return MODE_EDIT_ERROR_MESSAGE.CONFLICT;
    }
  }

  return MODE_EDIT_ERROR_MESSAGE.DEFAULT;
};

// 모드 수정 페이지에서 필요한 데이터 조회 + 수정/삭제 제출 로직을 한 곳에 모은 커스텀 훅
export const useModeEditPage = () => {
  const { modeId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const deletedModeIdRef = useRef<number | null>(null);
  const parsedModeId = Number(modeId);
  const isValidModeId = Number.isInteger(parsedModeId);
  const [errorMessage, setErrorMessage] = useState('');
  // 삭제 확인 모달의 열림/닫힘 상태
  const deleteConfirmModal = useModal();
  // 활성 모드 삭제 시 "다른 모드로 전환 후 삭제" 안내 모달의 열림/닫힘 상태
  const activateDeleteModal = useModal();
  const {
    data: modeDetailData,
    isLoading: isModeDetailLoading,
    isError: isModeDetailError,
  } = useGetModeDetail(isValidModeId ? parsedModeId : null);
  const { data: modesData } = useGetModes();
  const { mutateAsync: updateMode, isPending: isUpdatingMode } = usePutMode();
  const { mutateAsync: deleteMode, isPending: isDeletingMode } =
    useDeleteMode();
  const { mutateAsync: activateMode, isPending: isActivatingMode } =
    usePatchActivateMode();

  // 현재 보고 있는 모드가 활성 모드인지 (modes 목록의 is_active 기준)
  const currentMode = modesData?.modes.find(
    (mode) => mode.mode_id === parsedModeId,
  );
  const isCurrentModeActive = currentMode?.is_active ?? false;

  useEffect(() => {
    return () => {
      const deletedModeId = deletedModeIdRef.current;

      if (deletedModeId === null) return;

      queryClient.removeQueries({
        queryKey: ['modes', deletedModeId],
        exact: true,
      });
    };
  }, [queryClient]);

  const handleModeUpdateSubmit = async ({
    name,
    icon,
    // soundIds는 생성 폼 전용이다. 수정 페이지는 기존 소리 목록을 그대로 유지하므로 사용하지 않는다.
  }: ModeFormSubmitDataTypes) => {
    if (!modeDetailData) return;

    const trimmedName = name.trim();

    if (!trimmedName) {
      setErrorMessage(MODE_MESSAGE.EMPTY_NAME);
      return;
    }

    if (trimmedName.length > MAX_MODE_NAME_LENGTH) {
      setErrorMessage(MODE_MESSAGE.TOO_LONG_NAME);
      return;
    }

    try {
      await updateMode({
        modeId: parsedModeId,
        modeData: {
          name: trimmedName,
          icon,
          // 이름과 아이콘만 수정해도 기존 소리 목록은 함께 보내서 서버 상태를 유지한다.
          sounds: modeDetailData.sounds.map((sound) => ({
            sound_id: sound.sound_id,
            name: sound.name,
          })),
        },
      });
      navigate('/');
    } catch (error) {
      setErrorMessage(getModeEditErrorMessage(error));
    }
  };

  // 삭제 버튼 클릭: 최소 개수 검증 후, 활성 모드면 전환 안내 모달을, 아니면 삭제 확인 모달을 연다.
  const handleModeDeleteClick = () => {
    if (!modeDetailData) return;

    if ((modesData?.modes.length ?? 0) <= 1) {
      setErrorMessage(MODE_MESSAGE.MIN_MODE_COUNT);
      return;
    }

    if (isCurrentModeActive) {
      activateDeleteModal.open();
      return;
    }

    deleteConfirmModal.open();
  };

  // 확인 모달에서 "확인"을 눌렀을 때 실제 삭제를 수행한다.
  const handleModeDeleteConfirm = async () => {
    try {
      await deleteMode(parsedModeId);
      deletedModeIdRef.current = parsedModeId;
      navigate('/', { replace: true });
    } catch (error) {
      setErrorMessage(getModeEditErrorMessage(error));
    }
  };

  // 활성 모드 전환 안내 모달에서 "확인": 다른 모드를 활성화한 뒤 현재 모드를 삭제한다.
  const handleActiveModeDeleteConfirm = async () => {
    // 삭제 대상을 제외한 첫 번째 모드를 다음 활성 모드로 선택
    const nextMode = modesData?.modes.find(
      (mode) => mode.mode_id !== parsedModeId,
    );

    if (!nextMode) return;

    try {
      await activateMode(nextMode.mode_id);
      await deleteMode(parsedModeId);
      deletedModeIdRef.current = parsedModeId;
      navigate('/', { replace: true });
    } catch (error) {
      setErrorMessage(getModeEditErrorMessage(error));
    }
  };

  const clearErrorMessage = () => setErrorMessage('');

  return {
    modeDetailData,
    errorMessage,
    isValidModeId,
    isModeDetailLoading,
    isModeDetailError,
    isUpdatingMode,
    // 삭제 또는 다른 모드 활성화가 진행 중이면 버튼을 비활성화한다.
    isDeletingMode: isDeletingMode || isActivatingMode,
    isDeleteConfirmOpen: deleteConfirmModal.isOpen,
    isActivateDeleteOpen: activateDeleteModal.isOpen,
    activeDeleteMessage: MODE_MESSAGE.ACTIVE_DELETE_CONFIRM(
      modeDetailData?.name ?? '',
    ),
    handleModeUpdateSubmit,
    handleModeDeleteClick,
    handleModeDeleteConfirm,
    handleActiveModeDeleteConfirm,
    closeDeleteConfirm: deleteConfirmModal.close,
    closeActivateDelete: activateDeleteModal.close,
    clearErrorMessage,
  };
};
