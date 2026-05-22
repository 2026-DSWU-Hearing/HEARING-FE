import { useState } from 'react';
import { isAxiosError } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import type { ModeFormSubmitDataTypes } from '@/pages/home/components/modeForm/ModeFormContext';
import { useDeleteMode } from '@/pages/home/hooks/useDeleteMode';
import { useGetModeDetail } from '@/pages/home/hooks/useGetModeDetail';
import { useGetModes } from '@/pages/home/hooks/useGetModes';
import { usePutMode } from '@/pages/home/hooks/usePutMode';

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
  }: ModeFormSubmitDataTypes) => {
    if (!modeDetailData) return;

    const trimmedName = name.trim();

    if (!trimmedName) {
      setErrorMessage('모드 이름을 입력해주세요');
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

  const handleModeDeleteClick = async () => {
    if (!modeDetailData) return;

    if ((modesData?.modes.length ?? 0) <= 1) {
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
