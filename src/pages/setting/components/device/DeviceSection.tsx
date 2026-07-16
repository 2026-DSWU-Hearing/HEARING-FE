import { faMicrochip } from '@fortawesome/free-solid-svg-icons';

import ConfirmModal from '@/shared/components/ConfirmModal';
import SettingSectionTitle from '@/pages/setting/components/SettingSectionTitle';
import SettingCard from '@/pages/setting/components/SettingCard';
import DeviceStatusGrid from '@/pages/setting/components/device/DeviceStatusGrid';
import ConnectDeviceBtn from '@/pages/setting/components/device/ConnectDeviceBtn';
import DeleteDeviceBtn from '@/pages/setting/components/device/DeleteDeviceBtn';
import DeviceNameEditModal from '@/pages/setting/components/device/DeviceNameEditModal';
import DeviceRegisterModal from '@/shared/components/DeviceRegisterModal';
import { SettingCardSkeleton } from '@/pages/setting/components/SettingSkeleton';
import { DEVICE_MESSAGE } from '@/pages/setting/constants/deviceMessages';
import { useDeviceSection } from '@/pages/setting/hooks/useDeviceSection';

/**
 * 나의 디바이스 섹션. 등록 여부·연결 여부·대기 시간으로 4상태를 분기한다.
 * - 미등록: "디바이스 등록" 버튼
 * - 등록 + 연결 대기 중: "기기 연결 중..." + 삭제 버튼
 * - 등록 + 대기 시간 초과: 실패 안내 + "다시 찾기" + 삭제 버튼
 * - 등록 + 연결: 디바이스 카드(이름·배터리·연결 상태) + 삭제 버튼
 * 조회·매핑·등록/삭제/이름변경 로직은 useDeviceSection 훅에 있다.
 */
const DeviceSection = () => {
  const {
    name,
    batteryLevel,
    connectionStatus,
    isConnected,
    isRegistered,
    isWaitingForConnection,
    isLoading,
    isError,
    isMutating,
    isCreating,
    registerErrorMessage,
    nameModal,
    registerModal,
    deleteModal,
    handleEditClick,
    handleNameSubmit,
    handleRegisterClick,
    handleCloseRegisterModal,
    handleRegisterSubmit,
    handleRetryClick,
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
      <SettingSectionTitle title="나의 디바이스" />

      {!isRegistered && (
        <ConnectDeviceBtn
          label="디바이스 등록"
          onClick={handleRegisterClick}
          disabled={isMutating}
        />
      )}

      {isRegistered && !isConnected && isWaitingForConnection && (
        <div className="flex flex-col gap-sm">
          <p
            role="status"
            className="flex items-center rounded-xl bg-neutral-900 px-base py-base body-base-regular text-secondary"
          >
            {DEVICE_MESSAGE.CONNECTING}
          </p>
          <DeleteDeviceBtn onClick={handleDeleteClick} />
        </div>
      )}

      {isRegistered && !isConnected && !isWaitingForConnection && (
        <div className="flex flex-col gap-sm">
          <p className="flex items-center whitespace-pre-line rounded-xl bg-neutral-900 px-base py-base body-base-regular text-secondary">
            {DEVICE_MESSAGE.CONNECT_FAILED}
          </p>
          <ConnectDeviceBtn
            label="다시 찾기"
            onClick={handleRetryClick}
            disabled={isMutating}
          />
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
          onClose={handleCloseRegisterModal}
          onSubmit={handleRegisterSubmit}
          isPending={isCreating}
          errorMessage={registerErrorMessage}
        />
      )}

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
