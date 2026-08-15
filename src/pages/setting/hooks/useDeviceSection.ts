import { useState } from 'react';

import { useGetDevices } from '@/pages/setting/hooks/useGetDevices';
import { usePatchDevice } from '@/pages/setting/hooks/usePatchDevice';
import { useDeleteDevice } from '@/pages/setting/hooks/useDeleteDevice';
import { useDevicesConnect } from '@/shared/hooks/useDevicesConnect';
import { useModal } from '@/shared/hooks/useModal';
import { CONNECTION_STATUS } from '@/pages/setting/constants/connectionStatus';

/**
 * 나의 디바이스 섹션의 조회·연결·연결 해제·이름변경 로직을 모은 커스텀 훅.
 * 서버가 POST /devices/connect 시점에 ESP32 접속 여부를 동기 판단하므로,
 * 프론트는 더 이상 연결 대기/타임아웃 상태를 갖지 않는다.
 */
export const useDeviceSection = () => {
  const [hasConnectError, setHasConnectError] = useState(false);
  const { data: devices, isLoading, isError } = useGetDevices();
  const { mutate: updateDevice, isPending: isUpdating } = usePatchDevice();
  const { mutateAsync: connectDevice, isPending: isConnecting } =
    useDevicesConnect();
  const { mutate: removeDevice, isPending: isDeleting } = useDeleteDevice();

  const isMutating = isUpdating || isConnecting || isDeleting;

  const device = devices?.[0];
  const isConnected = device?.is_connected ?? false;
  const isActiveUser = device?.is_active_user ?? false;

  const nameModal = useModal();
  const deleteModal = useModal();

  const handleEditClick = () => nameModal.open();

  const handleNameSubmit = (newName: string) => {
    if (!device) return;
    updateDevice({ deviceId: device.id, deviceData: { nickname: newName } });
  };

  const handleConnectClick = async () => {
    if (isMutating) return;

    setHasConnectError(false);

    try {
      await connectDevice();
    } catch {
      setHasConnectError(true);
    }
  };

  const handleDeleteClick = () => deleteModal.open();

  const handleConfirmDelete = () => {
    if (!device || isMutating) return;

    removeDevice(device.id, {
      onSuccess: () => setHasConnectError(false),
    });
  };

  const name = device?.nickname ?? '';
  const batteryLevel = device?.battery_level ?? null;
  const connectionStatus = isConnected
    ? CONNECTION_STATUS.CONNECTED
    : CONNECTION_STATUS.DISCONNECTED;

  return {
    name,
    batteryLevel,
    connectionStatus,
    isConnected,
    isActiveUser,
    isLoading,
    isError,
    isMutating,
    isConnecting,
    hasConnectError,
    nameModal,
    deleteModal,
    handleEditClick,
    handleNameSubmit,
    handleConnectClick,
    handleDeleteClick,
    handleConfirmDelete,
  };
};
