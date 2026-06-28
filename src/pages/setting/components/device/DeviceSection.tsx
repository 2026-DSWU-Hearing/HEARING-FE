import { faMicrochip } from '@fortawesome/free-solid-svg-icons';

import ConfirmModal from '@/shared/components/ConfirmModal';
import SettingSectionTitle from '@/pages/setting/components/SettingSectionTitle';
import SettingCard from '@/pages/setting/components/SettingCard';
import DeviceStatusGrid from '@/pages/setting/components/device/DeviceStatusGrid';
import ConnectDeviceBtn from '@/pages/setting/components/device/ConnectDeviceBtn';
import DeviceNameEditModal from '@/pages/setting/components/device/DeviceNameEditModal';
import { SettingCardSkeleton } from '@/pages/setting/components/SettingSkeleton';
import { useDeviceSection } from '@/pages/setting/hooks/useDeviceSection';

/**
 * 나의 디바이스 섹션.
 * 연결됨: 섹션 제목(연결 해제하기) + 디바이스 카드(기기 이름·배터리·연결 상태).
 * 미연결: 골드 "디바이스 연결하기" 버튼만 표시한다.
 * 조회·매핑·연결/해제/이름변경 로직은 useDeviceSection 훅에 있다.
 */
const DeviceSection = () => {
  const {
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
  } = useDeviceSection();

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
