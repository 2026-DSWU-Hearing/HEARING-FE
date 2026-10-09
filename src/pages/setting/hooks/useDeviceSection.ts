import { useState } from 'react';

import { useDeviceConnection } from '@/pages/setting/hooks/useDeviceConnection';
import { usePatchDevice } from '@/pages/setting/hooks/usePatchDevice';
import { useDeleteDevice } from '@/pages/setting/hooks/useDeleteDevice';
import { useDevicesConnect } from '@/shared/hooks/useDevicesConnect';
import { useModal } from '@/shared/hooks/useModal';
import { CONNECTION_STATUS } from '@/pages/setting/constants/connectionStatus';
import { DEVICE_MESSAGE } from '@/shared/constants/deviceMessages';
import { getDeviceConnectErrorMessage } from '@/shared/utils/getDeviceConnectErrorMessage';

/**
 * 나의 디바이스 섹션의 조회·연결·연결 해제·이름변경 로직을 모은 커스텀 훅.
 * 서버가 POST /devices/connect 시점에 ESP32 접속 여부를 동기 판단하므로,
 * 프론트는 더 이상 연결 대기/타임아웃 상태를 갖지 않는다.
 */
export const useDeviceSection = () => {
  // 각 요청의 실패 안내. 비어 있으면 안내를 띄우지 않는다.
  const [connectErrorMessage, setConnectErrorMessage] = useState('');
  const [nameEditErrorMessage, setNameEditErrorMessage] = useState('');
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');
  const { device, isConnected, isActiveUser, isLoading, isError } =
    useDeviceConnection();
  const { mutateAsync: updateDevice, isPending: isUpdating } =
    usePatchDevice();
  const { mutateAsync: connectDevice, isPending: isConnecting } =
    useDevicesConnect();
  const { mutate: removeDevice, isPending: isDeleting } = useDeleteDevice();

  const isMutating = isUpdating || isConnecting || isDeleting;

  const nameModal = useModal();
  const deleteModal = useModal();

  const handleEditClick = () => {
    setNameEditErrorMessage('');
    nameModal.open();
  };

  // 저장이 성공했을 때만 모달을 닫는다. 실패하면 입력값을 유지한 채 모달 안에 안내한다.
  const handleNameSubmit = async (newName: string) => {
    if (!device || isUpdating) return;

    setNameEditErrorMessage('');

    try {
      await updateDevice({
        deviceId: device.id,
        deviceData: { nickname: newName },
      });
      nameModal.close();
    } catch {
      setNameEditErrorMessage(DEVICE_MESSAGE.RENAME_FAILED);
    }
  };

  const handleConnectClick = async () => {
    if (isMutating) return;

    setConnectErrorMessage('');

    try {
      await connectDevice();
    } catch (error) {
      // 409(기기 미접속)만 전원·Wi-Fi 안내, 그 외는 요청 실패로 구분해 안내한다.
      setConnectErrorMessage(getDeviceConnectErrorMessage(error));
    }
  };

  const handleDeleteClick = () => {
    setDeleteErrorMessage('');
    deleteModal.open();
  };

  // 확인 모달은 확인 즉시 닫히므로, 실패 안내는 기기 카드 아래에 띄운다.
  const handleConfirmDelete = () => {
    if (!device || isMutating) return;

    removeDevice(device.id, {
      onSuccess: () => setConnectErrorMessage(''),
      onError: () => setDeleteErrorMessage(DEVICE_MESSAGE.DISCONNECT_FAILED),
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
    isUpdating,
    connectErrorMessage,
    nameEditErrorMessage,
    deleteErrorMessage,
    nameModal,
    deleteModal,
    handleEditClick,
    handleNameSubmit,
    handleConnectClick,
    handleDeleteClick,
    handleConfirmDelete,
  };
};
