import { useState } from 'react';
import { isAxiosError } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import type { ModeFormSubmitDataTypes } from '@/pages/home/components/modeForm/ModeFormContext';
import { MAX_MODE_NAME_LENGTH } from '@/pages/home/components/modeForm/ModeFormContext';
import {
  MODE_EDIT_ERROR_MESSAGE,
  MODE_MESSAGE,
} from '@/pages/home/constants/modeMessages';
import { useDeleteMode } from '@/pages/home/hooks/useDeleteMode';
import { useGetModeDetail } from '@/pages/home/hooks/useGetModeDetail';
import { useGetModes } from '@/pages/home/hooks/useGetModes';
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
  const parsedModeId = Number(modeId);
  const isValidModeId = Number.isInteger(parsedModeId);
  const [errorMessage, setErrorMessage] = useState('');
  // 삭제 확인 모달의 열림/닫힘 상태
  const deleteConfirmModal = useModal();
  const {
    data: modeDetailData,
    isLoading: isModeDetailLoading,
    isError: isModeDetailError,
  } = useGetModeDetail(isValidModeId ? parsedModeId : null);
  const { data: modesData } = useGetModes();
  const { mutateAsync: updateMode, isPending: isUpdatingMode } = usePutMode();
  const { mutateAsync: deleteMode, isPending: isDeletingMode } =
    useDeleteMode();

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

  // 삭제 버튼 클릭: 최소 개수 검증 후 확인 모달을 연다.
  const handleModeDeleteClick = () => {
    if (!modeDetailData) return;

    if ((modesData?.modes.length ?? 0) <= 1) {
      setErrorMessage(MODE_MESSAGE.MIN_MODE_COUNT);
      return;
    }

    deleteConfirmModal.open();
  };

  // 확인 모달에서 "확인"을 눌렀을 때 실제 삭제를 수행한다.
  const handleModeDeleteConfirm = async () => {
    try {
      await deleteMode(parsedModeId);
      navigate('/');
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
    isDeletingMode,
    isDeleteConfirmOpen: deleteConfirmModal.isOpen,
    handleModeUpdateSubmit,
    handleModeDeleteClick,
    handleModeDeleteConfirm,
    closeDeleteConfirm: deleteConfirmModal.close,
    clearErrorMessage,
  };
};
