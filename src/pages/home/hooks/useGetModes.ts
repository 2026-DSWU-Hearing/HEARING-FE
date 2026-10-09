import { useQuery } from '@tanstack/react-query';
import { getModes } from '@/pages/home/apis/getModes';

// 모드 목록 전체를 조회하는 query 훅 (홈 화면 모드 탭의 데이터 출처)
export const useGetModes = () => {
  return useQuery({
    queryKey: ['modes'],
    queryFn: getModes,
  });
};
