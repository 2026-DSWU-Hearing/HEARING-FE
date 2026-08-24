import CategoryBlock from '@/pages/home/components/sound/CategoryBlock';
import { useCategoryBar } from '@/pages/home/hooks/useCategoryBar';
import { useHorizontalDragScroll } from '@/pages/home/hooks/useHorizontalDragScroll';

interface CategoryBarPropTypes {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const CategoryBar = ({
  selectedCategory,
  onCategoryChange,
}: CategoryBarPropTypes) => {
  const {
    categories,
    isLoading,
    isError,
    handleAllCategoryClick,
    handleCategoryChange,
  } = useCategoryBar({ onCategoryChange });
  const {
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handleClickCapture,
  } = useHorizontalDragScroll();

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onClickCapture={handleClickCapture}
      className={`flex cursor-grab gap-xs overflow-x-auto py-1 select-none touch-pan-x [&>*]:shrink-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
        isDragging ? 'cursor-grabbing' : ''
      }`}
    >
      <CategoryBlock
        categoryName="전체"
        variant="filter"
        isSelected={selectedCategory === null}
        onClick={handleAllCategoryClick}
      />

      {isLoading && (
        <span className="whitespace-nowrap text-sm text-neutral-400">
          카테고리 불러오는 중...
        </span>
      )}

      {isError && (
        <span className="whitespace-nowrap text-sm text-neutral-400">
          카테고리 없음
        </span>
      )}

      {categories.map((category) => (
        <CategoryBlock
          key={category.category_id}
          categoryName={category.name}
          variant="filter"
          isSelected={selectedCategory === category.name}
          onClick={handleCategoryChange}
        />
      ))}
    </div>
  );
};

export default CategoryBar;
