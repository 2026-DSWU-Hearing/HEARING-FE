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
        <span className="heading-lg-semibold truncate text-primary">
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
