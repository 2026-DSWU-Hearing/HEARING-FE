import { faMicrochip } from '@fortawesome/free-solid-svg-icons';

import ConfirmModal from '@/shared/components/ConfirmModal';
import { useModal } from '@/shared/hooks/useModal';
import SettingSectionTitle from '@/pages/setting/components/SettingSectionTitle';
import SettingCard from '@/pages/setting/components/SettingCard';
import DeviceStatusGrid from '@/pages/setting/components/device/DeviceStatusGrid';
import ConnectDeviceBtn from '@/pages/setting/components/device/ConnectDeviceBtn';
import DeviceNameEditModal from '@/pages/setting/components/device/DeviceNameEditModal';
import { useGetDevices } from '@/pages/setting/hooks/useGetDevices';
import { usePatchDevice } from '@/pages/setting/hooks/usePatchDevice';
import { SettingCardSkeleton } from '@/pages/setting/components/SettingSkeleton';
import { CONNECTION_STATUS } from '@/pages/setting/constants/connectionStatus';

/**
 * 나의 디바이스 섹션.
 * 연결됨: 섹션 제목(연결 해제하기) + 디바이스 카드(기기 이름·배터리·연결 상태).
 * 미연결: 골드 "디바이스 연결하기" 버튼만 표시한다.
 * 기기 정보는 GET /devices로 조회하고, 연결/해제/이름변경은 PATCH /devices/{id}로 저장한다.
 * (현재는 단일 기기 가정 — 응답 배열의 첫 번째 기기를 사용한다.)
 */
const DeviceSection = () => {
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

  if (isLoading) {
    return (
      <section className="flex flex-col gap-sm">
        <SettingSectionTitle title="나의 디바이스" />
        <SettingCardSkeleton />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="flex flex-col gap-sm">
        <SettingSectionTitle title="나의 디바이스" />
        <div className="flex items-center rounded-xl bg-neutral-900 px-base py-base body-base-regular text-secondary">
          기기 정보를 불러오지 못했습니다
        </div>
      </section>
    );
  }

  // API 응답(snake_case)을 UI 표시값으로 매핑한다.
  const name = device?.nickname ?? '';
  const batteryLevel = device?.battery_level ?? 0;
  const isConnected = device?.is_connected ?? false;
  const connectionStatus = isConnected
    ? CONNECTION_STATUS.CONNECTED
    : CONNECTION_STATUS.DISCONNECTED;

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
