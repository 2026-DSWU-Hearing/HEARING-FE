import { useCallback } from 'react';
import { useGetSoundCategories } from '@/pages/home/hooks/useGetSoundCategories';

interface UseCategoryBarParamTypes {
  onCategoryChange: (category: string | null) => void;
}

export const useCategoryBar = ({
  onCategoryChange,
}: UseCategoryBarParamTypes) => {
  const { data, isLoading, isError } = useGetSoundCategories();

  const handleAllCategoryClick = useCallback(() => {
    onCategoryChange(null);
  }, [onCategoryChange]);

  const handleCategoryChange = useCallback(
    (categoryName: string) => {
      onCategoryChange(categoryName);
    },
    [onCategoryChange],
  );

  return {
    categories: data?.categories ?? [],
    isLoading,
    isError,
    handleAllCategoryClick,
    handleCategoryChange,
  };
};
