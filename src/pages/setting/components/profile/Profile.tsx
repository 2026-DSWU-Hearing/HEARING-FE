import { useNavigate } from 'react-router-dom';

import {
  DISABILITY_TYPE,
  DISABILITY_TYPE_LABEL,
  type DisabilityTypeTypes,
} from '@/pages/setting/constants/disabilityType';

const Profile = () => {
  const navigate = useNavigate();

  // TODO(api): GET /users/me 로 프로필(닉네임·장애유형) 조회 후 대체한다.
  const nickname = '뽀롱이';
  const disabilityType: DisabilityTypeTypes = DISABILITY_TYPE.HARD_OF_HEARING;

  const handleEditClick = () => {
    navigate('/setting/profile/edit');
  };

  return (
    <div className="flex items-center gap-base rounded-xl bg-neutral-900 px-base py-base">
      {/* 프로필 이미지 영역. TODO(api/asset): 캐릭터 이미지 에셋 확정 시 교체한다. */}
      <div
        className="h-[3.75rem] w-[3.75rem] shrink-0 rounded-full bg-neutral-300"
        aria-hidden="true"
      />

      <div className="flex min-w-0 gap-[0.44rem] flex-1 flex-col">
        <span className="heading-lg-semibold truncate text-primary">
          {nickname}
        </span>
        <span className="heading-base-semibold text-secondary">
          {DISABILITY_TYPE_LABEL[disabilityType]}
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
