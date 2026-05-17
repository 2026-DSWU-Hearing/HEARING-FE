import type { SoundCategory } from '../../types/soundFiltering';

interface CategoryChipsProps {
  categories: SoundCategory[];
  selectedCategory: SoundCategory;
  onSelectCategory: (category: SoundCategory) => void;
}

const CategoryChips = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryChipsProps) => {
  return (
    <div role="tablist" aria-label="소리 카테고리">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          role="tab"
          aria-selected={category === selectedCategory}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryChips;
