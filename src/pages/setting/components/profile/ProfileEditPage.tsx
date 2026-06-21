import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import TopNavigation from '@/layout/TopNavigation';
import TextInput from '@/shared/components/TextInput';
import DisabilityTypeSelector from '@/pages/setting/components/profile/DisabilityTypeSelector';
import {
  DISABILITY_TYPE,
  type DisabilityTypeTypes,
} from '@/pages/setting/constants/disabilityType';
import {
  NICKNAME_MAX_LENGTH,
  PROFILE_MESSAGE,
} from '@/pages/setting/constants/profileMessages';

const ProfileEditPage = () => {
  const navigate = useNavigate();

  // TODO(api): GET /users/me 로 받아온 값으로 초기값을 채운다. 현재는 더미 값.
  const [nickname, setNickname] = useState('뽀롱이');
  const [disabilityType, setDisabilityType] = useState<DisabilityTypeTypes>(
    DISABILITY_TYPE.HARD_OF_HEARING,
  );

  const isNicknameTooLong = nickname.length > NICKNAME_MAX_LENGTH;
  const nicknameErrorMessage = isNicknameTooLong
    ? PROFILE_MESSAGE.TOO_LONG_NICKNAME
    : undefined;

  // 닉네임 길이가 기준을 넘으면 완료(저장)를 막는다.
  const isDoneDisabled = isNicknameTooLong;

  const handleNicknameChange = (value: string) => {
    setNickname(value);
  };

  const handleDisabilityTypeSelect = (value: DisabilityTypeTypes) => {
    setDisabilityType(value);
  };

  const handleDoneClick = () => {
    if (isDoneDisabled) {
      return;
    }

    // TODO(api): PATCH /users/me 로 닉네임·장애유형 저장 후 이동한다.
    navigate(-1);
  };

  return (
    <div className="flex flex-col">
      <TopNavigation
        title="프로필 수정"
        rightText="완료"
        onRightClick={handleDoneClick}
        rightVariant="active"
        isRightDisabled={isDoneDisabled}
      />

      <div className="flex flex-col gap-base px-[1.03rem]">
        <TextInput
          label="닉네임"
          value={nickname}
          placeholder="닉네임을 입력해주세요"
          onChange={handleNicknameChange}
          errorMessage={nicknameErrorMessage}
          maxLength={NICKNAME_MAX_LENGTH}
        />

        <DisabilityTypeSelector
          value={disabilityType}
          onChange={handleDisabilityTypeSelect}
        />
      </div>
    </div>
  );
};

export default ProfileEditPage;
