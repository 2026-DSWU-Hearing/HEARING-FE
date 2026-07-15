import { faMicrochip } from '@fortawesome/free-solid-svg-icons';

import ConfirmModal from '@/shared/components/ConfirmModal';
import SettingSectionTitle from '@/pages/setting/components/SettingSectionTitle';
import SettingCard from '@/pages/setting/components/SettingCard';
import DeviceStatusGrid from '@/pages/setting/components/device/DeviceStatusGrid';
import ConnectDeviceBtn from '@/pages/setting/components/device/ConnectDeviceBtn';
import DeleteDeviceBtn from '@/pages/setting/components/device/DeleteDeviceBtn';
import DeviceNameEditModal from '@/pages/setting/components/device/DeviceNameEditModal';
import DeviceRegisterModal from '@/pages/setting/components/device/DeviceRegisterModal';
import { SettingCardSkeleton } from '@/pages/setting/components/SettingSkeleton';
import { useDeviceSection } from '@/pages/setting/hooks/useDeviceSection';

/**
 * 나의 디바이스 섹션. 등록 여부·연결 여부로 3상태를 분기한다.
 * - 미등록: "디바이스 등록" 버튼
 * - 등록 + 연결 해제: 자동 연결 안내 문구 + 삭제 버튼
 * - 등록 + 연결: 디바이스 카드(이름·배터리·연결 상태) + "연결 해제하기" + 삭제 버튼
 * 조회·매핑·등록/연결/해제/삭제/이름변경 로직은 useDeviceSection 훅에 있다.
 */
const DeviceSection = () => {
  const {
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
    handleDisconnectClick,
    handleConfirmDisconnect,
    handleRegisterClick,
    handleRegisterSubmit,
    handleDeleteClick,
    handleConfirmDelete,
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

      {!isRegistered && (
        <ConnectDeviceBtn
          label="디바이스 등록"
          onClick={handleRegisterClick}
          disabled={isMutating}
        />
      )}

      {isRegistered && !isConnected && (
        <div className="flex flex-col gap-sm">
          <p className="flex items-center rounded-xl bg-neutral-900 px-base py-base body-base-regular text-secondary">
            디바이스 찾는 중...
          </p>
          <DeleteDeviceBtn onClick={handleDeleteClick} />
        </div>
      )}

      {isRegistered && isConnected && (
        <div className="flex flex-col gap-sm">
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
          <DeleteDeviceBtn onClick={handleDeleteClick} />
        </div>
      )}

      {nameModal.isOpen && (
        <DeviceNameEditModal
          currentName={name}
          onClose={nameModal.close}
          onSubmit={handleNameSubmit}
        />
      )}

      {registerModal.isOpen && (
        <DeviceRegisterModal
          onClose={registerModal.close}
          onSubmit={handleRegisterSubmit}
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
        confirmDisabled={isMutating}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        message={'기기를 삭제하시겠습니까?\n등록된 기기 정보가 모두 삭제됩니다.'}
        onConfirm={handleConfirmDelete}
        onCancel={deleteModal.close}
        onClose={deleteModal.close}
        confirmText="삭제"
        cancelText="취소"
        confirmDisabled={isMutating}
      />
    </section>
  );
};

export default DeviceSection;
