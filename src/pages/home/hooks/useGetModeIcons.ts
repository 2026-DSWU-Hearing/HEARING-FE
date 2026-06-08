import { useQuery } from '@tanstack/react-query';
import { getModeIcons } from '@/pages/home/apis/getModeIcons';

// 모드 아이콘 카탈로그 조회 훅 (아이콘 선택 picker의 데이터 출처).
// 서버에서도 정적인 목록이라 staleTime을 무한으로 두어 불필요한 refetch를 막는다.
export const useGetModeIcons = () => {
  return useQuery({
    queryKey: ['modes', 'icons'],
    queryFn: getModeIcons,
    staleTime: Infinity,
  });
};
