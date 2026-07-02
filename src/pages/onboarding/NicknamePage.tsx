import { useNavigate } from 'react-router-dom';

import TextInput from '@/shared/components/TextInput';
import { MAX_NICKNAME_LENGTH } from '@/pages/onboarding/constants/onboardingConstants';
import { useOnboardingForm } from '@/pages/onboarding/hooks/useOnboardingForm';

const NicknamePage = () => {
  const navigate = useNavigate();
  const { onboardingForm, updateOnboardingForm } = useOnboardingForm();

  const { nickname } = onboardingForm;

  const isNicknameEmpty = nickname.trim().length === 0;
  const isNicknameTooLong = nickname.length > MAX_NICKNAME_LENGTH;
  const isNextButtonDisabled = isNicknameEmpty || isNicknameTooLong;

  const nicknameErrorMessage = isNicknameTooLong
    ? `닉네임은 ${MAX_NICKNAME_LENGTH}자 이하로 입력해주세요.`
    : undefined;

  const handleNicknameChange = (value: string) => {
    updateOnboardingForm({
      nickname: value,
    });
  };

  const handleBackButtonClick = () => {
    navigate('/login');
  };

  const handleNextButtonClick = () => {
    if (isNextButtonDisabled) {
      return;
    }

    navigate('/onboarding/disability');
  };

  return (
    <main className="flex min-h-dvh w-full justify-center bg-neutral-950 text-primary">
      <section className="flex min-h-dvh w-full flex-col px-lg pb-lg pt-xl">
        <button
          type="button"
          className="mb-xl w-fit text-primary"
          onClick={handleBackButtonClick}
          aria-label="이전 페이지로 이동"
        >
          &lt;
        </button>

        <h1 className="heading-xl-semibold mb-[144px] text-primary">
          닉네임을 입력해주세요.
        </h1>

        <TextInput
          value={nickname}
          placeholder="닉네임을 입력해주세요."
          onChange={handleNicknameChange}
          errorMessage={nicknameErrorMessage}
          maxLength={MAX_NICKNAME_LENGTH}
          inputClassName="body-base-regular h-[48px] rounded-lg bg-neutral-900 px-base py-0"
        />

        <button
          type="button"
          disabled={isNextButtonDisabled}
          onClick={handleNextButtonClick}
          className="
            caption-xs-semibold
            mt-auto h-[48px] w-full rounded-pill
            bg-primary-400 text-neutral-950
            transition-all
            active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:bg-disabled
            disabled:text-neutral-800
          "
        >
          다음으로
        </button>
      </section>
    </main>
  );
};

export default NicknamePage;
