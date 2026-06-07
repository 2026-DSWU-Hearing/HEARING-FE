interface CategoryBlockPropTypes {
  categoryName: string;
  isSelected?: boolean;
  size?: 'small' | 'medium';
  onClick?: (categoryName: string) => void;
}

const getCategoryColorClassName = (categoryName: string) => {
  if (categoryName.includes('긴급') || categoryName.includes('위험')) {
    return 'border-red-500 text-red-500';
  }

  return 'border-blue-400 text-blue-400';
};

const CategoryBlock = ({
  categoryName,
  isSelected = false,
  size = 'small',
  onClick,
}: CategoryBlockPropTypes) => {
  const sizeClassName =
    size === 'medium'
      ? 'px-5 py-2 text-sm'
      : 'px-3 py-0.5 text-xs';
  const selectedClassName = isSelected
    ? 'border-neutral-900 bg-neutral-900 text-white'
    : getCategoryColorClassName(categoryName);

  const className = `whitespace-nowrap rounded-full border font-bold ${sizeClassName} ${selectedClassName}`;

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
