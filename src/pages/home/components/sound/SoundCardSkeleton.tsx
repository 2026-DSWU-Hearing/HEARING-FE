import Skeleton from 'react-loading-skeleton';

interface SoundCardSkeletonPropTypes {
  bgClassName?: string;
}

const SoundCardSkeleton = ({
  bgClassName = 'bg-neutral-800',
}: SoundCardSkeletonPropTypes) => {
  // 아이콘 원은 실제 카드의 SoundIconView와 동일한 clamp 비율을 써서
  // 로딩 → 렌더 전환 시 크기 점프가 생기지 않게 한다(@container 기준).
  // 실제 카드처럼 aspect-square 대신 min-h로 최소 높이만 맞춘다(소리명이 길면 실제 카드는 더 길어짐).
  return (
    <div
      className={`@container flex min-h-[7rem] flex-col rounded-xl p-sm ${bgClassName}`}
    >
      {/* 아이콘 + 소리명: 실제 카드처럼 남는 공간(flex-1)을 채우며 가운데 정렬 */}
      <div className="flex flex-1 flex-col items-center justify-center gap-xs">
        <Skeleton
          circle
          width="clamp(1.75rem,32cqi,2.25rem)"
          height="clamp(1.75rem,32cqi,2.25rem)"
        />
        <Skeleton width="3.5rem" height="0.875rem" />
      </div>

      {/* 카테고리: 실제 카드와 동일하게 바닥 고정 */}
      <div className="mt-xs flex justify-center">
        <Skeleton width="2.5rem" height="1rem" borderRadius="0.5rem" />
      </div>
    </div>
  );
};

export default SoundCardSkeleton;
