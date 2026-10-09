import { useNavigate } from 'react-router-dom';

import { useGetUsers } from '@/shared/hooks/useGetUsers';
import { ProfileSkeleton } from '@/pages/setting/components/SettingSkeleton';
import { getDisabilityLabel } from '@/pages/setting/constants/disabilityType';
import profileImage from '@/shared/assets/images/profile_image.svg';

const Profile = () => {
  const navigate = useNavigate();

  const { data: user, isLoading, isError } = useGetUsers();

  const handleEditClick = () => {
    navigate('/setting/profile/edit');
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError || !user) {
    return (
      <div className="flex items-center rounded-xl bg-neutral-900 px-base py-base body-base-regular text-secondary">
        프로필을 불러오지 못했습니다
      </div>
    );
  }

  const disabilityLabel = getDisabilityLabel(user.disability_type);

  return (
    <div className="flex items-center gap-base rounded-xl bg-neutral-900 px-base py-base">
      <img
        src={profileImage}
        alt="프로필 이미지"
        aria-hidden="true"
        className="h-[3.75rem] w-[3.75rem] shrink-0"
      />

      <div className="flex min-w-0 gap-[0.44rem] flex-1 flex-col">
        {/* 좁은 화면(320px)에서는 10글자가 한 줄에 안 들어가므로 두 줄까지 보여주고 그 이상만 말줄임한다.
            break-words는 공백 없는 영문 닉네임도 줄바꿈되게 한다. */}
        <span className="heading-lg-semibold break-words line-clamp-2 text-primary">
          {user.nickname}
        </span>
        <span className="heading-base-semibold text-secondary">
          {disabilityLabel}
        </span>
      </div>

      <button
        type="button"
        onClick={handleEditClick}
        className="self-start body-base-regular shrink-0 text-disabled"
      >
        프로필 수정
      </button>
    </div>
  );
};

export default Profile;
