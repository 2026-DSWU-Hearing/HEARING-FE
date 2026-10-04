import { useGetDevices } from '@/pages/setting/hooks/useGetDevices';

/**
 * 기기 연결 상태 판정 훅.
 * 넥밴드는 1대뿐이므로 목록의 첫 번째 기기만 본다.
 * - isConnected: 기기가 서버(ESP32 WS)에 접속해 있는지
 * - isActiveUser: 그 기기의 활성 사용자가 현재 계정인지
 * - isMyDeviceConnected: 둘 다 참. 기기 카드가 뜨고, 진동 등 하드웨어 설정이 의미를 갖는 상태
 */
export const useDeviceConnection = () => {
  const {
    data: devices,
    isLoading,
    isError: isFetchError,
  } = useGetDevices();

  const device = devices?.[0];
  const isConnected = device?.is_connected ?? false;
  const isActiveUser = device?.is_active_user ?? false;
  const isMyDeviceConnected = isConnected && isActiveUser;

  // 5초 폴링 중 한 번 실패해도 TanStack Query는 기존 data를 유지한다.
  // 그때마다 기기 카드를 오류 화면으로 바꾸면 화면이 깜빡이므로,
  // 보여줄 데이터가 전혀 없을 때만 에러로 취급한다(다음 폴링에서 자연 복구).
  const isError = isFetchError && devices === undefined;

  return {
    device,
    isConnected,
    isActiveUser,
    isMyDeviceConnected,
    isLoading,
    isError,
  };
};
