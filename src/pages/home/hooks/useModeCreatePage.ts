import { useState } from 'react';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import type { ModeFormSubmitDataTypes } from '@/pages/home/components/modeForm/ModeFormContext';
import { MAX_MODE_NAME_LENGTH } from '@/pages/home/components/modeForm/ModeFormContext';
import { useGetModes } from '@/pages/home/hooks/useGetModes';
import { useGetSounds } from '@/pages/home/hooks/useGetSounds';
import { usePostMode } from '@/pages/home/hooks/usePostMode';
import type { ModeSoundTypes } from '@/pages/home/types/modeTypes';

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
    // 선택된 소리 id를 서버 전송용 { sound_id, name } 형태로 변환한다.
    const allSounds = soundsData?.sounds ?? [];
    const selectedSounds: ModeSoundTypes[] = allSounds
      .filter((sound) => soundIds.includes(sound.sound_id))
      .map((sound) => ({ sound_id: sound.sound_id, name: sound.name }));

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

    // canSubmit으로 막고 있지만, 핸들러가 직접 호출되는 경로를 방어한다.
    if (selectedSounds.length === 0) {
      setErrorMessage('소리를 1개 이상 선택해주세요');
      return;
    }

    if ((modesData?.modes.length ?? 0) >= 6) {
      setErrorMessage('모드는 최대 6개까지 만들 수 있습니다');
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

  return {
    errorMessage,
    isCreatingMode,
    handleModeCreateSubmit,
  };
};
