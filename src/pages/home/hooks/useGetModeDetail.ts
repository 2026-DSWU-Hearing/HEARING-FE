import { useQuery } from '@tanstack/react-query';
import { getModeDetail } from '@/pages/home/apis/getModeDetail';

// 특정 모드의 상세 정보(담긴 소리 목록 포함)를 조회하는 query 훅. modeId가 null이면 호출하지 않는다.
export const useGetModeDetail = (modeId: number | null) => {
  return useQuery({
    queryKey: ['modes', modeId],
    queryFn: () => getModeDetail(modeId ?? 0),
    enabled: modeId !== null,
  });
};
