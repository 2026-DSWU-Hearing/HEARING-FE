import { isAxiosError } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ModeForm from '@/pages/home/components/modeForm/ModeForm';
import { useDeleteMode } from '@/pages/home/hooks/useDeleteMode';
import { useGetModeDetail } from '@/pages/home/hooks/useGetModeDetail';
import { useGetModes } from '@/pages/home/hooks/useGetModes';
import { usePutMode } from '@/pages/home/hooks/usePutMode';
import { useState } from 'react';

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

const ModeEditPage = () => {
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
  }: {
    name: string;
    icon: string;
  }) => {
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

  if (!isValidModeId) {
    return <div className="p-6">올바르지 않은 모드입니다</div>;
  }

  if (isModeDetailLoading) {
    return <div className="p-6">모드 정보를 불러오는 중...</div>;
  }

  if (isModeDetailError || !modeDetailData) {
    return <div className="p-6">모드 정보를 불러오지 못했습니다</div>;
  }

  return (
    <ModeForm
      pageType="edit"
      initialName={modeDetailData.name}
      initialIcon={modeDetailData.icon}
      errorMessage={errorMessage}
      isSubmitting={isUpdatingMode}
      isDeleting={isDeletingMode}
      onSubmit={handleModeUpdateSubmit}
      onDelete={handleModeDeleteClick}
    />
  );
};

export default ModeEditPage;
