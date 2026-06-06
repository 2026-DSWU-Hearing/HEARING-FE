import { useState } from 'react';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import type { ModeFormSubmitDataTypes } from '@/pages/home/components/modeForm/ModeFormContext';
import { MAX_MODE_NAME_LENGTH } from '@/pages/home/components/modeForm/ModeFormContext';
import {
  MODE_CREATE_ERROR_MESSAGE,
  MODE_MESSAGE,
} from '@/pages/home/constants/modeMessages';
import { useGetModes } from '@/pages/home/hooks/useGetModes';
import { useGetSounds } from '@/pages/home/hooks/useGetSounds';
import { usePostMode } from '@/pages/home/hooks/usePostMode';

const getModeCreateErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    if (error.response?.status === 400) {
      return MODE_CREATE_ERROR_MESSAGE.BAD_REQUEST;
    }

    if (error.response?.status === 409) {
      return MODE_CREATE_ERROR_MESSAGE.CONFLICT;
    }
  }

  return MODE_CREATE_ERROR_MESSAGE.DEFAULT;
};

// 모드 생성 페이지의 제출 로직을 모은 훅. 이름/소리/개수를 검증한 뒤 생성 요청을 보내고 성공 시 홈으로 이동한다.
export const useModeCreatePage = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const { data: modesData } = useGetModes();
  const { data: soundsData } = useGetSounds();
  const { mutateAsync: createMode, isPending: isCreatingMode } = usePostMode();

  const handleModeCreateSubmit = async ({
    name,
    icon,
    soundIds,
  }: ModeFormSubmitDataTypes) => {
    const trimmedName = name.trim();
    // 선택된 소리 중 실제로 존재하는 id만 추려 서버 전송용 number[] 로 만든다.
    const allSounds = soundsData ?? [];
    const selectedSoundIds = allSounds
      .filter((sound) => soundIds.includes(sound.id))
      .map((sound) => sound.id);

    if (!trimmedName) {
      setErrorMessage(MODE_MESSAGE.EMPTY_NAME);
      return;
    }

    if (trimmedName.length > MAX_MODE_NAME_LENGTH) {
      setErrorMessage(MODE_MESSAGE.TOO_LONG_NAME);
      return;
    }

    // canSubmit으로 막고 있지만, 핸들러가 직접 호출되는 경로를 방어한다.
    if (selectedSounds.length === 0) {
      setErrorMessage(MODE_MESSAGE.EMPTY_SOUND);
      return;
    }

    if ((modesData?.modes.length ?? 0) >= 6) {
      setErrorMessage(MODE_MESSAGE.MAX_MODE_COUNT);
      return;
    }

    try {
      await createMode({
        name: trimmedName,
        icon,
        sound_ids: selectedSoundIds,
      });
      navigate('/');
    } catch (error) {
      setErrorMessage(getModeCreateErrorMessage(error));
    }
  };

  const clearErrorMessage = () => setErrorMessage('');

  return {
    errorMessage,
    isCreatingMode,
    handleModeCreateSubmit,
    clearErrorMessage,
  };
};
