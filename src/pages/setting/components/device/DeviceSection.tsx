import { faMicrochip } from '@fortawesome/free-solid-svg-icons';

import ConfirmModal from '@/shared/components/ConfirmModal';
import SettingSectionTitle from '@/pages/setting/components/SettingSectionTitle';
import SettingCard from '@/pages/setting/components/SettingCard';
import DeviceStatusGrid from '@/pages/setting/components/device/DeviceStatusGrid';
import ConnectDeviceButton from '@/pages/setting/components/device/ConnectDeviceButton';
import DeleteDeviceButton from '@/pages/setting/components/device/DeleteDeviceButton';
import DeviceNameEditModal from '@/pages/setting/components/device/DeviceNameEditModal';
import { SettingCardSkeleton } from '@/pages/setting/components/SettingSkeleton';
import { DEVICE_MESSAGE } from '@/shared/constants/deviceMessages';
import { useDeviceSection } from '@/pages/setting/hooks/useDeviceSection';

/**
 * 나의 디바이스 섹션.
 * - 미연결: 연결 버튼 + 직전 연결 실패 안내
 * - 연결됨·타 계정 사용 중: 안내 + 내 계정으로 연결 버튼
 * - 연결됨·내가 활성: 기기 카드(연필로 이름 수정) + 연결 해제 버튼
 */
const DeviceSection = () => {
  const {
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

  const connectButtonLabel = isConnecting
    ? DEVICE_MESSAGE.CONNECTING_BUTTON
    : '연결하기';
  const activateButtonLabel = isConnecting
    ? DEVICE_MESSAGE.CONNECTING_BUTTON
    : '내 계정으로 연결';

  return (
    <section className="flex flex-col gap-sm">
      <SettingSectionTitle title="나의 디바이스" />

      {!isConnected && (
        <div className="flex flex-col gap-sm">
          <ConnectDeviceButton
            label={connectButtonLabel}
            onClick={handleConnectClick}
            disabled={isMutating}
          />
          {hasConnectError && (
            <p className="whitespace-pre-line text-center px-base body-sm-regular text-tertiary">
              {DEVICE_MESSAGE.CONNECT_FAILED}
            </p>
          )}
        </div>
      )}

      {isConnected && !isActiveUser && (
        <div className="flex flex-col gap-sm">
          <p className="rounded-xl bg-neutral-900 px-base py-base body-base-regular text-secondary">
            {DEVICE_MESSAGE.NOT_ACTIVE_USER}
          </p>
          <ConnectDeviceButton
            label={activateButtonLabel}
            onClick={handleConnectClick}
            disabled={isMutating}
          />
          {hasConnectError && (
            <p className="whitespace-pre-line rounded-xl bg-neutral-900 px-base py-base body-base-regular text-secondary">
              {DEVICE_MESSAGE.CONNECT_FAILED}
            </p>
          )}
        </div>
      )}

      {isConnected && isActiveUser && (
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
          <DeleteDeviceButton onClick={handleDeleteClick} />
        </div>
      )}

      {nameModal.isOpen && (
        <DeviceNameEditModal
          currentName={name}
          onClose={nameModal.close}
          onSubmit={handleNameSubmit}
        />
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        message={
          '기기 연결을 해제하시겠습니까?\n현재 계정에서 기기 연결이 해제됩니다.'
        }
        onConfirm={handleConfirmDelete}
        onCancel={deleteModal.close}
        onClose={deleteModal.close}
        confirmText="연결 해제"
        cancelText="취소"
        confirmDisabled={isMutating}
      />
    </section>
  );
};

export default DeviceSection;
