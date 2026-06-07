import { getCategoryColor } from '@/pages/home/constants/categoryColors';

// variant 로 "어디에 쓰이는 블럭인지"를 구분한다.
// - tag: 소리 카드 안의 카테고리 태그. 카테고리 고유색을 쓴다(기본값).
// - filter: 소리 추가 모달 상단의 카테고리 필터 바. 선택/미선택만 일관된 색으로 표현한다.
type CategoryBlockVariantTypes = 'tag' | 'filter';

interface CategoryBlockPropTypes {
  categoryName: string;
  variant?: CategoryBlockVariantTypes;
  isSelected?: boolean;
  isDisabled?: boolean;
  onClick?: (categoryName: string) => void;
}

// 필터 바(variant=filter): 카테고리 고유색을 쓰지 않고 선택 여부로만 색이 갈린다.
// - 선택됨: 옅은 노란 배경 + 노란(primary) 테두리/글자.
// - 미선택: 회색 배경 + 회색 글자.
// (레이아웃/패딩은 공통 className 에서 처리하고, 여기서는 색만 반환한다.)
const getFilterColor = (isSelected: boolean) =>
  isSelected
    ? 'bg-primary-500/10 border border-primary-500 text-primary-500'
    : 'bg-neutral-700 text-secondary';

// 태그(variant=tag) 색 우선순위: 비활성(방해금지) > 카테고리 고유색.
// (태그는 "선택" 개념이 없어 isSelected 를 보지 않는다.)
const getTagColor = ({
  categoryName,
  isDisabled,
}: {
  categoryName: string;
  isDisabled: boolean;
}) => {
  if (isDisabled) {
    return 'bg-neutral-700 text-secondary';
  }

  return getCategoryColor(categoryName);
};

const getCategoryBlockColor = ({
  categoryName,
  variant,
  isSelected,
  isDisabled,
}: {
  categoryName: string;
  variant: CategoryBlockVariantTypes;
  isSelected: boolean;
  isDisabled: boolean;
}) => {
  if (variant === 'filter') {
    return getFilterColor(isSelected);
  }

  return getTagColor({ categoryName, isDisabled });
};

const CategoryBlock = ({
  categoryName,
  variant = 'tag',
  isSelected = false,
  isDisabled = false,
  onClick,
}: CategoryBlockPropTypes) => {
  const colorClassName = getCategoryBlockColor({
    categoryName,
    variant,
    isSelected,
    isDisabled,
  });

  const className = `caption-xs-medium whitespace-nowrap rounded-full px-xs py-xxs min-w-[4.25rem] transition-colors duration-300 ease-in-out ${colorClassName}`;

  if (onClick) {
    const handleCategoryBlockClick = () => {
      onClick(categoryName);
    };

    return (
      <button
        type="button"
        onClick={handleCategoryBlockClick}
        className={className}
      >
        {categoryName}
      </button>
    );
  }

  return <span className={className}>{categoryName}</span>;
};

export default CategoryBlock;
