import { useGetDevices } from '@/pages/setting/hooks/useGetDevices';
import { usePatchDevice } from '@/pages/setting/hooks/usePatchDevice';
import { useModal } from '@/shared/hooks/useModal';
import { CONNECTION_STATUS } from '@/pages/setting/constants/connectionStatus';

/**
 * 나의 디바이스 섹션의 조회·매핑·연결/해제/이름변경 로직을 모은 커스텀 훅.
 * API 응답(snake_case)을 UI 표시값(camelCase)으로 매핑해 컴포넌트에 넘긴다.
 * (현재는 단일 기기 가정 — 응답 배열의 첫 번째 기기를 사용한다.)
 */
export const useDeviceSection = () => {
  const { data: devices, isLoading, isError } = useGetDevices();
  const { mutate: updateDevice } = usePatchDevice();

  const device = devices?.[0];

  const nameModal = useModal();
  const disconnectModal = useModal();

  const handleEditClick = () => nameModal.open();

  const handleNameSubmit = (newName: string) => {
    if (!device) return;
    updateDevice({ deviceId: device.id, deviceData: { nickname: newName } });
  };

  const handleDisconnectClick = () => disconnectModal.open();

  const handleConfirmDisconnect = () => {
    if (!device) return;
    updateDevice({ deviceId: device.id, deviceData: { is_connected: false } });
  };

  const handleConnectClick = () => {
    // 기기가 없으면(미등록) 재연결할 대상이 없어 동작하지 않는다.
    // TODO(api): 기기 등록(POST /devices) 작업에서 등록 모달 연결 — 회원가입 때 '나중에 하기'한 사용자용.
    if (!device) return;
    updateDevice({ deviceId: device.id, deviceData: { is_connected: true } });
  };

  // API 응답(snake_case)을 UI 표시값으로 매핑한다.
  const name = device?.nickname ?? '';
  const batteryLevel = device?.battery_level ?? 0;
  const isConnected = device?.is_connected ?? false;
  const connectionStatus = isConnected
    ? CONNECTION_STATUS.CONNECTED
    : CONNECTION_STATUS.DISCONNECTED;

  return {
    name,
    batteryLevel,
    connectionStatus,
    isConnected,
    isLoading,
    isError,
    nameModal,
    disconnectModal,
    handleEditClick,
    handleNameSubmit,
    handleConnectClick,
    handleDisconnectClick,
    handleConfirmDisconnect,
  };
};
