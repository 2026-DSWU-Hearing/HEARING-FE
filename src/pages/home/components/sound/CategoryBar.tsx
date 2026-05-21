import CategoryBlock from '@/pages/home/components/sound/CategoryBlock';
import { useGetSoundCategories } from '@/pages/home/hooks/useGetSoundCategories';

interface CategoryBarPropTypes {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const CategoryBar = ({
  selectedCategory,
  onCategoryChange,
}: CategoryBarPropTypes) => {
  const { data, isLoading, isError } = useGetSoundCategories();

  const handleAllCategoryClick = () => {
    onCategoryChange(null);
  };

  const handleCategoryChange = (categoryName: string) => {
    onCategoryChange(categoryName);
  };

  return (
    <div className="flex gap-3 overflow-x-auto py-1">
      <button
        type="button"
        onClick={handleAllCategoryClick}
        className={`whitespace-nowrap rounded-full border px-5 py-2 text-sm font-bold ${
          selectedCategory === null
            ? 'border-neutral-900 bg-neutral-900 text-white'
            : 'border-neutral-500 text-neutral-700'
        }`}
      >
        전체
      </button>

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

      {data?.categories.map((category) => (
        <CategoryBlock
          key={category.category_id}
          categoryName={category.name}
          isSelected={selectedCategory === category.name}
          size="medium"
          onClick={handleCategoryChange}
        />
      ))}
    </div>
  );
};

export default CategoryBar;
