import { useNavigate } from 'react-router-dom';

import { useGetUsers } from '@/pages/setting/hooks/useGetUsers';
import { ProfileSkeleton } from '@/pages/setting/components/SettingSkeleton';
import {
  DISABILITY_TYPE_LABEL,
  type DisabilityTypeTypes,
} from '@/pages/setting/constants/disabilityType';

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

  // disability_type은 서버 코드값(HARD_OF_HEARING/DEAF)과 일치한다고 가정한다.
  // null이거나 매핑에 없는 값이면 '미설정'으로 표시한다.
  const disabilityLabel =
    user.disability_type !== null
      ? (DISABILITY_TYPE_LABEL[user.disability_type as DisabilityTypeTypes] ??
        '미설정')
      : '미설정';

  return (
    <div className="flex items-center gap-base rounded-xl bg-neutral-900 px-base py-base">
      {/* 프로필 이미지 영역. TODO(api/asset): 캐릭터 이미지 에셋 확정 시 교체한다. */}
      <div
        className="h-[3.75rem] w-[3.75rem] shrink-0 rounded-full bg-neutral-300"
        aria-hidden="true"
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
