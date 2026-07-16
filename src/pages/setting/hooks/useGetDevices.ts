import { useQuery } from '@tanstack/react-query';
import { getDevices } from '@/shared/apis/getDevices';
import { DEVICE_STATUS_POLLING_INTERVAL_MS } from '@/pages/setting/constants/deviceStatus';

// 기기 목록을 조회하는 query 훅.
// 배터리/연결 상태는 하드웨어→백엔드로 갱신되므로, 일정 주기로 재조회해 최신값을 반영한다.
// 단, 등록된 기기가 있을 때만 폴링한다. 미등록/삭제 상태면 폴링을 멈춰 불필요한 요청을 막는다.
// (미연결 상태에서도 폴링을 유지해 하드웨어가 접속하는 순간을 자동으로 감지한다.)
// refetchIntervalInBackground는 기본 false라 다른 탭·백그라운드에서는 폴링이 자동으로 멈춘다.
export const useGetDevices = () => {
  return useQuery({
    queryKey: ['devices'],
    queryFn: getDevices,
    refetchInterval: (query) => {
      const devices = query.state.data;
      const hasDevice = Array.isArray(devices) && devices.length > 0;
      return hasDevice ? DEVICE_STATUS_POLLING_INTERVAL_MS : false;
    },
  });
};
