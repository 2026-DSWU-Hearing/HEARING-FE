import { useCallback, useMemo } from 'react';
import { useGetSoundCategories } from '@/pages/home/hooks/useGetSoundCategories';
import { filterVisibleCategories } from '@/pages/home/utils/filterSoundCatalog';

interface UseCategoryBarParamTypes {
  onCategoryChange: (category: string | null) => void;
}

// 소리 추가 모달의 카테고리 필터 바를 담당하는 훅. 카테고리 목록 조회 + "전체/개별" 선택 핸들러를 제공한다.
export const useCategoryBar = ({
  onCategoryChange,
}: UseCategoryBarParamTypes) => {
  const { data, isLoading, isError } = useGetSoundCategories();
  const categories = useMemo(
    () => filterVisibleCategories(data?.categories ?? []),
    [data?.categories],
  );

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
    categories,
    isLoading,
    isError,
    handleAllCategoryClick,
    handleCategoryChange,
  };
};
