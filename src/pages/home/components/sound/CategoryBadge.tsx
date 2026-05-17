import type { SoundCategory } from '../../types/soundFiltering';

interface CategoryBadgeProps {
  category: SoundCategory;
}
// 소리 카테고리를 나타내는 배지 컴포넌트
const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  return <div className="text-sm border p-1 rounded-2xl">{category}</div>;
};

export default CategoryBadge;
