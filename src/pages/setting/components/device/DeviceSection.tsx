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
import type { ConnectionStatusTypes } from '@/pages/setting/constants/connectionStatus';

// TODO(api): GET /devices(가칭)로 조회 후 더미 상수를 대체한다.
const DUMMY_BATTERY_LEVEL = 80;

/**
 * 나의 디바이스 섹션.
 * 연결됨: 섹션 제목(연결 해제하기) + 디바이스 카드(기기 이름·배터리·연결 상태).
 * 미연결: 골드 "디바이스 연결하기" 버튼만 표시한다.
 * 연결 상태·기기 이름은 API 부재로 현재 client state로 관리한다.
 */
const DeviceSection = () => {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatusTypes>(CONNECTION_STATUS.CONNECTED);
  const [deviceName, setDeviceName] = useState('ESP32');

  const isConnected = connectionStatus === CONNECTION_STATUS.CONNECTED;

  const nameModal = useModal();
  const disconnectModal = useModal();

  const handleEditClick = () => nameModal.open();

  const handleNameSubmit = (name: string) => {
    setDeviceName(name);
    // TODO(api): PATCH /devices(가칭)로 기기 이름 변경 요청.
  };

  const handleDisconnectClick = () => disconnectModal.open();

  const handleConfirmDisconnect = () => {
    setConnectionStatus(CONNECTION_STATUS.DISCONNECTED);
    // TODO(api): 디바이스 연결 해제 요청.
  };

  const handleConnectClick = () => {
    setConnectionStatus(CONNECTION_STATUS.CONNECTED);
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
          title={deviceName}
          onEdit={handleEditClick}
        >
          <DeviceStatusGrid
            batteryLevel={DUMMY_BATTERY_LEVEL}
            connectionStatus={connectionStatus}
          />
        </SettingCard>
      ) : (
        <ConnectDeviceBtn onClick={handleConnectClick} />
      )}

      {nameModal.isOpen && (
        <DeviceNameEditModal
          currentName={deviceName}
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
