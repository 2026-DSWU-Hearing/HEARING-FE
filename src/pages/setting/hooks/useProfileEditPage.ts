import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useGetUsers } from '@/pages/setting/hooks/useGetUsers';
import { usePatchUsers } from '@/pages/setting/hooks/usePatchUsers';
import {
  DISABILITY_TYPE,
  toDisabilityType,
  type DisabilityTypeTypes,
} from '@/pages/setting/constants/disabilityType';
import {
  NICKNAME_MAX_LENGTH,
  PROFILE_MESSAGE,
} from '@/pages/setting/constants/profileMessages';

// 프로필 수정 페이지의 조회·폼 상태·유효성·저장 로직을 한 곳에 모은 커스텀 훅.
export const useProfileEditPage = () => {
  const navigate = useNavigate();

  const { data: user } = useGetUsers();
  const { mutateAsync: updateUsers, isPending: isUpdatingUsers } =
    usePatchUsers();

  const [nickname, setNickname] = useState('');
  const [disabilityType, setDisabilityType] = useState<DisabilityTypeTypes>(
    DISABILITY_TYPE.HARD_OF_HEARING,
  );

  // 조회한 사용자 정보로 폼 초기값을 한 번만 채운다.
  // (입력 중 재조회로 값이 덮어써지지 않도록 isInitialized 가드를 둔다.)
  const isInitialized = useRef(false);
  useEffect(() => {
    if (isInitialized.current || !user) {
      return;
    }

    setNickname(user.nickname);
    const initialDisabilityType = toDisabilityType(user.disability_type);
    if (initialDisabilityType !== null) {
      setDisabilityType(initialDisabilityType);
    }
    isInitialized.current = true;
  }, [user]);

  const isNicknameEmpty = nickname.trim().length === 0;
  const isNicknameTooLong = nickname.length > NICKNAME_MAX_LENGTH;
  const nicknameErrorMessage = isNicknameTooLong
    ? PROFILE_MESSAGE.TOO_LONG_NICKNAME
    : isNicknameEmpty
      ? PROFILE_MESSAGE.EMPTY_NICKNAME
      : undefined;

  // 닉네임이 비어있거나 길이가 기준을 넘거나 저장 중이면 완료(저장)를 막는다.
  const isDoneDisabled = isNicknameEmpty || isNicknameTooLong || isUpdatingUsers;

  const handleNicknameChange = (value: string) => {
    setNickname(value);
  };

  const handleDisabilityTypeSelect = (value: DisabilityTypeTypes) => {
    setDisabilityType(value);
  };

  const handleDoneClick = async () => {
    if (isDoneDisabled) {
      return;
    }

    await updateUsers({
      nickname: nickname.trim(),
      disability_type: disabilityType,
    });
    navigate(-1);
  };

  return {
    nickname,
    disabilityType,
    nicknameErrorMessage,
    isDoneDisabled,
    handleNicknameChange,
    handleDisabilityTypeSelect,
    handleDoneClick,
  };
};
