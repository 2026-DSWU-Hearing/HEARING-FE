import { useQuery } from '@tanstack/react-query';

import { getCommunicationMock } from '@/pages/communication/apis/getCommunicationMock';

// 양방향 소통 페이지 목데이터 조회 
export const useGetCommunicationMock = () => {
  return useQuery({
    queryKey: ['communicationMock'],
    queryFn: getCommunicationMock,
  });
};
