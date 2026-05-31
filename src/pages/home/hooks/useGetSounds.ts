import { useQuery } from '@tanstack/react-query';
import { getSounds } from '@/pages/home/apis/getSounds';

// 선택 가능한 전체 소리 목록을 조회하는 query 훅 (소리 추가 모달, 모드 생성 폼에서 사용)
export const useGetSounds = () => {
  return useQuery({
    queryKey: ['sounds'],
    queryFn: getSounds,
  });
};
