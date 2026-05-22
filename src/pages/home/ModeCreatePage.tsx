import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import ModeForm from '@/pages/home/components/modeForm/ModeForm';
import { useGetModes } from '@/pages/home/hooks/useGetModes';
import { usePostMode } from '@/pages/home/hooks/usePostMode';
import type { ModeSoundTypes } from '@/pages/home/types/modeTypes';
import { useState } from 'react';

const getModeCreateErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    if (error.response?.status === 400) {
      return '모드 이름과 소리를 다시 확인해주세요';
    }

    if (error.response?.status === 409) {
      return '이미 사용 중인 모드 이름입니다';
    }
  }

  return '새 모드를 저장하지 못했습니다';
};

const ModeCreatePage = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const { data: modesData } = useGetModes();
  const { mutateAsync: createMode, isPending: isCreatingMode } = usePostMode();
  const selectedSounds: ModeSoundTypes[] = [];

  const handleModeCreateSubmit = async ({
    name,
    icon,
  }: {
    name: string;
    icon: string;
  }) => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setErrorMessage('모드 이름을 입력해주세요');
      return;
    }

    if ((modesData?.modes.length ?? 0) >= 6) {
      setErrorMessage('모드는 최대 6개까지 만들 수 있습니다');
      return;
    }

    if (selectedSounds.length === 0) {
      setErrorMessage('소리를 1개 이상 선택해주세요');
      return;
    }

    try {
      await createMode({
        name: trimmedName,
        icon,
        sounds: selectedSounds,
      });
      navigate('/');
    } catch (error) {
      setErrorMessage(getModeCreateErrorMessage(error));
    }
  };

  return (
    <ModeForm
      pageType="create"
      errorMessage={errorMessage}
      isSubmitting={isCreatingMode}
      onSubmit={handleModeCreateSubmit}
    />
  );
};

export default ModeCreatePage;
