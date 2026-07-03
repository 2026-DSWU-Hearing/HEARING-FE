import { useNavigate } from 'react-router-dom';

import LongConfirmButton from '@/pages/onboarding/components/LongConfirmButton';
import OnboardingLayout from '@/pages/onboarding/components/OnboardingLayout';
import { MAX_NICKNAME_LENGTH } from '@/pages/onboarding/constants/onboardingConstants';
import TextInput from '@/shared/components/TextInput';
import { useOnboardingStore } from '@/pages/onboarding/stores/useOnboardingStore';

const NicknamePage = () => {
  const navigate = useNavigate();
  const nickname = useOnboardingStore((state) => state.nickname);
  const setNickname = useOnboardingStore((state) => state.setNickname);

  const isNicknameEmpty = nickname.trim().length === 0;
  const isNicknameTooLong = nickname.length > MAX_NICKNAME_LENGTH;
  const isNextButtonDisabled = isNicknameEmpty || isNicknameTooLong;

  const nicknameErrorMessage = isNicknameTooLong
    ? `닉네임은 ${MAX_NICKNAME_LENGTH}자 이하로 입력해주세요.`
    : undefined;

  const handleNextButtonClick = () => {
    if (isNextButtonDisabled) return;

    navigate('/onboarding/disability');
  };

  return (
    <OnboardingLayout
      title="닉네임을 입력해주세요."
      onBackClick={() => navigate('/login')}
    >
      <div className="mt-[206px]">
        <TextInput
          value={nickname}
          placeholder="닉네임을 입력해주세요."
          onChange={setNickname}
          errorMessage={nicknameErrorMessage}
          maxLength={MAX_NICKNAME_LENGTH}
          inputClassName="body-base-regular h-[48px] rounded-lg px-base py-0"
        />
      </div>

      <LongConfirmButton
        disabled={isNextButtonDisabled}
        onClick={handleNextButtonClick}
        className="mt-auto"
      >
        다음으로
      </LongConfirmButton>
    </OnboardingLayout>
  );
};

export default NicknamePage;
