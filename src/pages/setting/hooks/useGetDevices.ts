import { useQuery } from '@tanstack/react-query';
import { getDevices } from '@/pages/setting/apis/getDevices';

// 기기 목록을 조회하는 query 훅.
export const useGetDevices = () => {
  return useQuery({
    queryKey: ['devices'],
    queryFn: getDevices,
  });
};
