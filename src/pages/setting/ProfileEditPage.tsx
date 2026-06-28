import TopNavigation from '@/layout/TopNavigation';
import TextInput from '@/shared/components/TextInput';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import DisabilityTypeSelector from '@/pages/setting/components/profile/DisabilityTypeSelector';
import { useProfileEditPage } from '@/pages/setting/hooks/useProfileEditPage';
import { NICKNAME_MAX_LENGTH } from '@/pages/setting/constants/profileMessages';

const ProfileEditPage = () => {
  const {
    nickname,
    disabilityType,
    nicknameErrorMessage,
    isDoneDisabled,
    isLoading,
    handleNicknameChange,
    handleDisabilityTypeSelect,
    handleDoneClick,
  } = useProfileEditPage();

  return (
    <div className="flex min-h-dvh flex-col">
      <TopNavigation
        title="프로필 수정"
        rightText="완료"
        onRightClick={handleDoneClick}
        rightVariant="active"
        isRightDisabled={isDoneDisabled}
      />

      {isLoading ? (
        <div className="flex-1">
          <LoadingSpinner />
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default ProfileEditPage;
