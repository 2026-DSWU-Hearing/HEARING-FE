import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/pages/setting/apis/getUsers';

// 내 정보를 조회하는 query 훅.
export const useGetUsers = () => {
  return useQuery({
    queryKey: ['users', 'me'],
    queryFn: getUsers,
  });
};
