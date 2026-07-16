import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useGetUsers } from '@/shared/hooks/useGetUsers';
import { usePatchUsers } from '@/pages/setting/hooks/usePatchUsers';
import {
  toDisabilityType,
  type DisabilityTypeTypes,
} from '@/pages/setting/constants/disabilityType';
import type { UpdateUsersRequestTypes } from '@/pages/setting/types/usersTypes';
import {
  NICKNAME_MAX_LENGTH,
  PROFILE_MESSAGE,
} from '@/pages/setting/constants/profileMessages';

// 프로필 수정 페이지의 조회·폼 상태·유효성·저장 로직을 한 곳에 모은 커스텀 훅.
export const useProfileEditPage = () => {
  const navigate = useNavigate();

  const { data: user, isLoading } = useGetUsers();
  const { mutateAsync: updateUsers, isPending: isUpdatingUsers } =
    usePatchUsers();

  const [nickname, setNickname] = useState('');
  // 미설정(또는 미지원 코드값)은 기본값으로 메우지 않고 null로 둔다.
  // (기본값을 넣으면 닉네임만 고쳐도 disability_type이 의도치 않게 저장됨)
  const [disabilityType, setDisabilityType] =
    useState<DisabilityTypeTypes | null>(null);

  // 조회한 사용자 정보로 폼 초기값을 한 번만 채운다.
  // (입력 중 재조회로 값이 덮어써지지 않도록 isInitialized 가드를 둔다.)
  // state로 두어 초기화 완료 시 리렌더되며 유효성 검증이 갱신되게 한다.
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    if (isInitialized || !user) {
      return;
    }

    setNickname(user.nickname);
    // 서버 값이 미설정/미지원이면 null로 두어 selector에 아무것도 선택되지 않게 한다.
    setDisabilityType(toDisabilityType(user.disability_type));
    setIsInitialized(true);
  }, [user, isInitialized]);

  const isNicknameEmpty = nickname.trim().length === 0;
  const isNicknameTooLong = nickname.length > NICKNAME_MAX_LENGTH;
  // 초기값 주입 전에는 '빈 닉네임 = 에러'로 오판해 깜빡이지 않도록 에러를 숨긴다.
  const nicknameErrorMessage = !isInitialized
    ? undefined
    : isNicknameTooLong
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

    const payload: UpdateUsersRequestTypes = { nickname: nickname.trim() };
    // 미설정(null)일 땐 PATCH에서 제외해 기존 서버 값을 덮어쓰지 않는다.
    if (disabilityType !== null) {
      payload.disability_type = disabilityType;
    }

    await updateUsers(payload);
    navigate(-1);
  };

  return {
    nickname,
    disabilityType,
    nicknameErrorMessage,
    isDoneDisabled,
    isLoading,
    handleNicknameChange,
    handleDisabilityTypeSelect,
    handleDoneClick,
  };
};
