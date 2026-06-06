import CategoryBlock from '@/pages/home/components/sound/CategoryBlock';

// SoundCard 는 소리 목록(SoundListItem)과 모드 상세 소리(ModeDetailSound) 양쪽에서 쓰인다.
// 두 타입은 카테고리 표현이 다르므로(category_name vs category 문자열), 카드가 실제 쓰는
// 최소 공통 필드만 prop 으로 받는다. categoryName 은 호출부에서 알맞게 뽑아 넘긴다.
interface SoundCardPropTypes {
  soundId: number;
  name: string;
  categoryName: string;
  // 방해금지 모드: 전체 비활성(어두운 회색). 다른 어떤 상태보다 우선한다.
  isDoNotDisturb?: boolean;
  // 편집 모드 진입 여부. 진입하면 ON 이던 소리도 회색으로 깔린다.
  isEditMode?: boolean;
  // 편집 모드에서 삭제 대상으로 체크됐는지.
  isChecked?: boolean;
  // 평상시 소리 켜짐(ON) 여부. ON 이면 금색 카드.
  isOn?: boolean;
  onClick?: (soundId: number) => void;
}

// 카드 시각 상태(우선순위 순):
//  1) 방해금지(isDoNotDisturb): 카드·텍스트·태그 모두 어두운 검은 회색. 클릭 불가.
//  2) 편집 모드(isEditMode):
//       - 체크됨(isChecked): 금색 카드(선택 표시)
//       - 체크 안 됨: ON 이던 소리도 회색 glass 로 깔림
//  3) 평상시: ON(isOn) 이면 금색 카드, OFF 면 어두운 glass.
//
// 반환값 분리: 금색 그라데이션(card-true-bottomsheet)은 background-image 라 transition 이
// 안 먹어 끊긴다. 그래서 그라데이션은 별도 absolute 레이어로 깔고 isGold 로 opacity 만 토글한다.
//  - base: 카드 바닥(항상 깔리는 단색 배경 + border). 단색끼리는 transition-colors 로 부드럽게 전환.
//  - isGold: 금색 그라데이션 레이어를 보일지 여부.
const getSoundCardStyle = ({
  isDoNotDisturb,
  isEditMode,
  isChecked,
  isOn,
}: {
  isDoNotDisturb: boolean;
  isEditMode: boolean;
  isChecked: boolean;
  isOn: boolean;
}) => {
  const isGold = isDoNotDisturb
    ? false
    : isEditMode
      ? isChecked
      : isOn;

  // 바닥 배경: 방해금지는 더 어두운 회색, 그 외(금색 포함)는 어두운 유리 위에 그라데이션이 덮인다.
  const base = isDoNotDisturb
    ? 'bg-neutral-900'
    : 'bg-neutral-800 border-[1px] border-neutral-600 tag-glass-effect';

  return {
    base,
    isGold,
    label: isDoNotDisturb ? 'text-neutral-600' : 'text-primary',
    icon: isDoNotDisturb ? 'text-neutral-600' : 'text-primary',
  };
};

const SoundCard = ({
  soundId,
  name,
  categoryName,
  isDoNotDisturb = false,
  isEditMode = false,
  isChecked = false,
  isOn = false,
  onClick,
}: SoundCardPropTypes) => {
  const handleSoundCardClick = () => {
    if (isDoNotDisturb) return;
    onClick?.(soundId);
  };

  const { base, isGold, label, icon } = getSoundCardStyle({
    isDoNotDisturb,
    isEditMode,
    isChecked,
    isOn,
  });

  return (
    <button
      type="button"
      onClick={handleSoundCardClick}
      disabled={isDoNotDisturb}
      className={`relative aspect-square overflow-hidden rounded-xl p-sm text-center transition-colors duration-300 ease-in-out ${base}`}
    >
      {/* 금색 그라데이션 레이어. background-image 는 보간이 안 돼 transition 이 끊기므로,
          card-true-bottomsheet 를 absolute 레이어로 깔고 opacity 로 크로스페이드한다. */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 card-true-bottomsheet transition-opacity duration-300 ease-in-out ${
          isGold ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-xs">
        <span
          className={`flex h-9 w-9 items-center justify-center leading-none transition-colors duration-300 ease-in-out ${icon}`}
        >
          {/* TODO: 물방울 아이콘 자산으로 교체 (현재는 자리표시) */}♪
        </span>
        <span
          className={`heading-base-semibold transition-colors duration-300 ease-in-out ${label}`}
        >
          {name}
        </span>
        <CategoryBlock
          categoryName={categoryName}
          isDisabled={isDoNotDisturb}
        />
      </div>
    </button>
  );
};

export default SoundCard;
