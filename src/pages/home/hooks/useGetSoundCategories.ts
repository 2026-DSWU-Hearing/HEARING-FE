import { useQuery } from '@tanstack/react-query';
import { getSoundCategories } from '../apis/getSoundCategories';

// 소리 카테고리 목록을 조회하는 query 훅 (소리 추가 모달의 카테고리 필터 바에서 사용)
export const useGetSoundCategories = () => {
  return useQuery({
    queryKey: ['soundCategories'],
    queryFn: getSoundCategories,
  });
};
