import { useGetDevices } from '@/pages/setting/hooks/useGetDevices';
import { usePatchDevice } from '@/pages/setting/hooks/usePatchDevice';
import { usePostDevice } from '@/pages/setting/hooks/usePostDevice';
import { useDeleteDevice } from '@/pages/setting/hooks/useDeleteDevice';
import { useModal } from '@/shared/hooks/useModal';
import { generateMockMacAddress } from '@/pages/setting/utils/generateMockMacAddress';
import { CONNECTION_STATUS } from '@/pages/setting/constants/connectionStatus';

/**
 * 나의 디바이스 섹션의 조회·매핑·연결/해제/이름변경 로직을 모은 커스텀 훅.
 * API 응답(snake_case)을 UI 표시값(camelCase)으로 매핑해 컴포넌트에 넘긴다.
 * (현재는 단일 기기 가정 — 응답 배열의 첫 번째 기기를 사용한다.)
 */
export const useDeviceSection = () => {
  const { data: devices, isLoading, isError } = useGetDevices();
  const { mutate: updateDevice, isPending: isUpdating } = usePatchDevice();
  const { mutate: createDevice, isPending: isCreating } = usePostDevice();
  const { mutate: removeDevice, isPending: isDeleting } = useDeleteDevice();

  // 등록/연결/해제/삭제 중 하나라도 진행 중이면 버튼·모달 확인을 막아 연타·중복 요청을 방지한다.
  const isMutating = isUpdating || isCreating || isDeleting;

  const device = devices?.[0];
  // 등록 여부 (미등록/등록 상태 분기용)
  const isRegistered = device !== undefined;

  const nameModal = useModal();
  const disconnectModal = useModal();
  const registerModal = useModal();
  const deleteModal = useModal();

  const handleEditClick = () => nameModal.open();

  const handleNameSubmit = (newName: string) => {
    if (!device) return;
    updateDevice({ deviceId: device.id, deviceData: { nickname: newName } });
  };

  const handleDisconnectClick = () => disconnectModal.open();

  const handleConfirmDisconnect = () => {
    if (!device || isMutating) return;
    updateDevice({ deviceId: device.id, deviceData: { is_connected: false } });
  };

  const handleConnectClick = () => {
    // 등록된(연결 해제 상태) 기기를 다시 연결한다. 미등록 상태에선 이 핸들러가 호출되지 않는다.
    if (!device || isMutating) return;
    updateDevice({ deviceId: device.id, deviceData: { is_connected: true } });
  };

  const handleRegisterClick = () => registerModal.open();

  const handleRegisterSubmit = (nickname: string) => {
    if (isMutating) return;
    // TODO(api): 실제 BLE 페어링 시 generateMockMacAddress()를 페어링 MAC으로 교체.
    createDevice({ nickname, mac_address: generateMockMacAddress() });
  };

  const handleDeleteClick = () => deleteModal.open();

  const handleConfirmDelete = () => {
    if (!device || isMutating) return;
    removeDevice(device.id);
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
    isRegistered,
    isLoading,
    isError,
    isMutating,
    nameModal,
    disconnectModal,
    registerModal,
    deleteModal,
    handleEditClick,
    handleNameSubmit,
    handleConnectClick,
    handleDisconnectClick,
    handleConfirmDisconnect,
    handleRegisterClick,
    handleRegisterSubmit,
    handleDeleteClick,
    handleConfirmDelete,
  };
};
