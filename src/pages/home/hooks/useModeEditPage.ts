import { useState } from 'react';
import { isAxiosError } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import type { ModeFormSubmitDataTypes } from '@/pages/home/components/modeForm/ModeFormContext';
import { MAX_MODE_NAME_LENGTH } from '@/pages/home/components/modeForm/ModeFormContext';
import { useDeleteMode } from '@/pages/home/hooks/useDeleteMode';
import { useGetModeDetail } from '@/pages/home/hooks/useGetModeDetail';
import { useGetModes } from '@/pages/home/hooks/useGetModes';
import { usePutMode } from '@/pages/home/hooks/usePutMode';

// 에러 메시지 변환
const getModeEditErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    if (error.response?.status === 400) {
      return '입력한 모드 정보를 다시 확인해주세요';
    }

    if (error.response?.status === 404) {
      return '존재하지 않는 모드입니다';
    }

    if (error.response?.status === 409) {
      return '이미 사용 중인 모드 이름입니다';
    }
  }

  return '모드 설정을 처리하지 못했습니다';
};

// 모드 수정 페이지에서 필요한 데이터 조회 + 수정/삭제 제출 로직을 한 곳에 모은 커스텀 훅
export const useModeEditPage = () => {
  const { modeId } = useParams();
  const navigate = useNavigate();
  const parsedModeId = Number(modeId);
  const isValidModeId = Number.isInteger(parsedModeId);
  const [errorMessage, setErrorMessage] = useState('');
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
      setErrorMessage('모드 이름을 입력해주세요');
      return;
    }

    if (trimmedName.length > MAX_MODE_NAME_LENGTH) {
      setErrorMessage(
        `모드 이름은 ${MAX_MODE_NAME_LENGTH}글자 이하로 입력해주세요`,
      );
      return;
    }

    try {
      await updateMode({
        modeId: parsedModeId,
        // 백엔드 PATCH /modes/{id} 는 이름/아이콘만 받는다. 소리 목록은 별도 엔드포인트로 관리한다.
        modeData: {
          name: trimmedName,
          icon,
        },
      });
      navigate('/');
    } catch (error) {
      setErrorMessage(getModeEditErrorMessage(error));
    }
  };

  const handleModeDeleteClick = async () => {
    if (!modeDetailData) return;

    if ((modesData?.length ?? 0) <= 1) {
      setErrorMessage('모드는 최소 1개 이상 유지해야 합니다');
      return;
    }

    const shouldDeleteMode = window.confirm('모드를 삭제할까요?');

    if (!shouldDeleteMode) return;

    try {
      await deleteMode(parsedModeId);
      navigate('/');
    } catch (error) {
      setErrorMessage(getModeEditErrorMessage(error));
    }
  };

  return {
    modeDetailData,
    errorMessage,
    isValidModeId,
    isModeDetailLoading,
    isModeDetailError,
    isUpdatingMode,
    isDeletingMode,
    handleModeUpdateSubmit,
    handleModeDeleteClick,
  };
};
