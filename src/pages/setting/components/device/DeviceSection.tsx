import { useState } from 'react';
import { faMicrochip } from '@fortawesome/free-solid-svg-icons';

import ConfirmModal from '@/shared/components/ConfirmModal';
import { useModal } from '@/shared/hooks/useModal';
import SettingSectionTitle from '@/pages/setting/components/SettingSectionTitle';
import SettingCard from '@/pages/setting/components/SettingCard';
import DeviceStatusGrid from '@/pages/setting/components/device/DeviceStatusGrid';
import ConnectDeviceBtn from '@/pages/setting/components/device/ConnectDeviceBtn';
import DeviceNameEditModal from '@/pages/setting/components/device/DeviceNameEditModal';
import { CONNECTION_STATUS } from '@/pages/setting/constants/connectionStatus';
import type { DeviceInfoTypes } from '@/pages/setting/types/deviceTypes';

// TODO(api): GET /devices(가칭)로 조회 후 더미 값을 대체한다.
const DUMMY_DEVICE_INFO: DeviceInfoTypes = {
  name: 'ESP32',
  batteryLevel: 80,
  connectionStatus: CONNECTION_STATUS.CONNECTED,
};

/**
 * 나의 디바이스 섹션.
 * 연결됨: 섹션 제목(연결 해제하기) + 디바이스 카드(기기 이름·배터리·연결 상태).
 * 미연결: 골드 "디바이스 연결하기" 버튼만 표시한다.
 * 연결 상태·기기 이름은 API 부재로 현재 client state로 관리한다.
 */
const DeviceSection = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfoTypes>(DUMMY_DEVICE_INFO);

  const { name, batteryLevel, connectionStatus } = deviceInfo;
  const isConnected = connectionStatus === CONNECTION_STATUS.CONNECTED;

  const nameModal = useModal();
  const disconnectModal = useModal();

  const handleEditClick = () => nameModal.open();

  const handleNameSubmit = (newName: string) => {
    setDeviceInfo((prev) => ({ ...prev, name: newName }));
    // TODO(api): PATCH /devices(가칭)로 기기 이름 변경 요청.
  };

  const handleDisconnectClick = () => disconnectModal.open();

  const handleConfirmDisconnect = () => {
    setDeviceInfo((prev) => ({
      ...prev,
      connectionStatus: CONNECTION_STATUS.DISCONNECTED,
    }));
    // TODO(api): 디바이스 연결 해제 요청.
  };

  const handleConnectClick = () => {
    setDeviceInfo((prev) => ({
      ...prev,
      connectionStatus: CONNECTION_STATUS.CONNECTED,
    }));
    // TODO(api): 디바이스 연결 요청.
  };

  return (
    <section className="flex flex-col gap-sm">
      <SettingSectionTitle
        title="나의 디바이스"
        actionLabel={isConnected ? '연결 해제하기' : undefined}
        onActionClick={isConnected ? handleDisconnectClick : undefined}
      />

      {isConnected ? (
        <SettingCard
          icon={faMicrochip}
          label="기기 이름"
          title={name}
          onEdit={handleEditClick}
        >
          <DeviceStatusGrid
            batteryLevel={batteryLevel}
            connectionStatus={connectionStatus}
          />
        </SettingCard>
      ) : (
        <ConnectDeviceBtn onClick={handleConnectClick} />
      )}

      {nameModal.isOpen && (
        <DeviceNameEditModal
          currentName={name}
          onClose={nameModal.close}
          onSubmit={handleNameSubmit}
        />
      )}

      <ConfirmModal
        isOpen={disconnectModal.isOpen}
        message="연결을 해제하시겠습니까?"
        onConfirm={handleConfirmDisconnect}
        onCancel={disconnectModal.close}
        onClose={disconnectModal.close}
        confirmText="해제"
        cancelText="취소"
      />
    </section>
  );
};

export default DeviceSection;
