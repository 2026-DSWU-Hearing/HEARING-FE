import Skeleton from 'react-loading-skeleton';

/**
 * 설정 페이지 조회 로딩용 Skeleton 모음.
 * 색상·shimmer 애니메이션은 main.tsx의 전역 <SkeletonTheme>를 그대로 따른다.
 * 실제 콘텐츠와 비슷한 크기/레이아웃으로 레이아웃 시프트를 줄인다.
 */

/** Profile 카드(아바타 + 닉네임·장애유형 2줄) 모양의 Skeleton. */
export const ProfileSkeleton = () => (
  <div className="flex items-center gap-base rounded-xl bg-neutral-900 px-base py-base">
    <Skeleton circle width="3.75rem" height="3.75rem" />
    <div className="flex flex-1 flex-col gap-[0.44rem]">
      <Skeleton width="40%" height="1.25rem" />
      <Skeleton width="25%" height="1rem" />
    </div>
  </div>
);

/**
 * NotificationToggleBar(제목 + 스위치) 모양의 Skeleton.
 * 서버에서 받은 값이 토글의 진실 원천이므로, 조회 전에는 임의의 기본값(꺼짐)을
 * 보여주지 않고 Skeleton으로 대체해 실제와 다른 상태가 노출되는 것을 막는다.
 */
export const NotificationToggleBarSkeleton = () => (
  <div className="flex items-center justify-between rounded-xl bg-neutral-900 px-lg py-lg">
    <Skeleton width="6rem" height="1.25rem" />
    <Skeleton width="3.25rem" height="1.75rem" borderRadius="9999px" />
  </div>
);

/**
 * SettingCard 골격(글래스 카드 + 헤더 + 본문) 모양의 Skeleton.
 * 디바이스 카드·진동 카드 등 SettingCard를 쓰는 영역의 로딩에 재사용한다.
 */
export const SettingCardSkeleton = () => (
  <div className="flex flex-col gap-base rounded-xl bg-[#21221E80]/50 tag-glass-effect px-base py-lg">
    {/* 헤더: 아이콘 + 라벨/제목 */}
    <div className="flex items-center gap-sm">
      <Skeleton width="2.25rem" height="2.25rem" borderRadius="0.5rem" />
      <div className="flex flex-1 flex-col gap-xxs">
        <Skeleton width="30%" height="0.75rem" />
        <Skeleton width="45%" height="1rem" />
      </div>
    </div>
    {/* 본문 */}
    <Skeleton height="2.25rem" />
  </div>
);
