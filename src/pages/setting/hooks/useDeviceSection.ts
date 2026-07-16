import { useEffect, useState } from 'react';

import { useGetDevices } from '@/pages/setting/hooks/useGetDevices';
import { usePatchDevice } from '@/pages/setting/hooks/usePatchDevice';
import { usePostDevice } from '@/pages/setting/hooks/usePostDevice';
import { useDeleteDevice } from '@/pages/setting/hooks/useDeleteDevice';
import { useModal } from '@/shared/hooks/useModal';
import { CONNECTION_STATUS } from '@/pages/setting/constants/connectionStatus';
import { DEVICE_CONNECT_TIMEOUT_MS } from '@/pages/setting/constants/deviceStatus';
import { DEVICE_MESSAGE } from '@/pages/setting/constants/deviceMessages';

/**
 * 나의 디바이스 섹션의 조회·매핑·등록/삭제/이름변경 로직을 모은 커스텀 훅.
 * API 응답(snake_case)을 UI 표시값(camelCase)으로 매핑해 컴포넌트에 넘긴다.
 * (현재는 단일 기기 가정 — 응답 배열의 첫 번째 기기를 사용한다.)
 *
 * 연결 여부(is_connected)는 하드웨어의 사실이므로 프론트가 바꾸지 않는다.
 * 서버가 ESP32의 접속 상태로 판단한 값을 폴링해 표시만 한다.
 */
export const useDeviceSection = () => {
  const { data: devices, isLoading, isError } = useGetDevices();
  const { mutate: updateDevice, isPending: isUpdating } = usePatchDevice();
  const {
    mutate: createDevice,
    isPending: isCreating,
    isError: isCreateError,
    reset: resetCreate,
  } = usePostDevice();
  const { mutate: removeDevice, isPending: isDeleting } = useDeleteDevice();

  // 등록/수정/삭제 중 하나라도 진행 중이면 버튼·모달 확인을 막아 연타·중복 요청을 방지한다.
  const isMutating = isUpdating || isCreating || isDeleting;

  const device = devices?.[0];
  // 등록 여부 (미등록/등록 상태 분기용)
  const isRegistered = device !== undefined;
  const isConnected = device?.is_connected ?? false;

  // 등록 성공 시각. null이면 대기 중이 아니다(이미 연결됐거나 예전에 등록한 기기).
  // 서버 응답만으로는 "방금 등록해 기다리는 중"과 "예전에 등록했는데 기기가 꺼진 상태"를
  // 구분할 수 없다(둘 다 is_connected: false). 그래서 등록 시각을 프론트가 들고 있는다.
  const [registeredAt, setRegisteredAt] = useState<number | null>(null);
  const [isTimedOut, setIsTimedOut] = useState(false);

  const nameModal = useModal();
  const registerModal = useModal();
  const deleteModal = useModal();

  // 대기 시간을 초과하면 실패 안내로 전환한다. 무한 대기로 사용자가 갇히는 것을 막는다.
  // registeredAt이 바뀌면(재시도) 이전 타이머는 정리되므로 새 대기가 즉시 실패로 뒤집히지 않는다.
  useEffect(() => {
    if (registeredAt === null) return;

    const timer = setTimeout(
      () => setIsTimedOut(true),
      DEVICE_CONNECT_TIMEOUT_MS,
    );
    return () => clearTimeout(timer);
  }, [registeredAt]);

  // 기기가 붙으면 isConnected가 true가 되어 대기가 자동으로 끝난다.
  // registeredAt을 따로 비울 필요가 없다(파생값이므로 state 동기화 불필요).
  const isWaitingForConnection =
    registeredAt !== null && !isTimedOut && !isConnected;

  const handleEditClick = () => nameModal.open();

  const handleNameSubmit = (newName: string) => {
    if (!device) return;
    updateDevice({ deviceId: device.id, deviceData: { nickname: newName } });
  };

  const handleRegisterClick = () => registerModal.open();

  // 모달을 닫을 때 이전 실패 상태를 지운다.
  // 남겨두면 다시 열었을 때 지난 에러 메시지가 그대로 보인다.
  const handleCloseRegisterModal = () => {
    registerModal.close();
    resetCreate();
  };

  const handleRegisterSubmit = (nickname: string) => {
    if (isMutating) return;

    createDevice(
      { nickname },
      {
        // 등록 성공 여부는 여기서만 알 수 있으므로 모달을 닫는 책임도 호출부에 둔다.
        onSuccess: () => {
          setRegisteredAt(Date.now());
          setIsTimedOut(false);
          handleCloseRegisterModal();
        },
      },
    );
  };

  // 재시도는 타이머만 리셋한다. 등록은 이미 성공했고 문제는 하드웨어 연결이므로
  // 기기를 다시 등록할 필요가 없다.
  const handleRetryClick = () => {
    setRegisteredAt(Date.now());
    setIsTimedOut(false);
  };

  const handleDeleteClick = () => deleteModal.open();

  const handleConfirmDelete = () => {
    if (!device || isMutating) return;

    removeDevice(device.id, {
      // 삭제 후 재등록할 때 이전 대기 상태가 남아있지 않도록 정리한다.
      onSuccess: () => {
        setRegisteredAt(null);
        setIsTimedOut(false);
      },
    });
  };

  // API 응답(snake_case)을 UI 표시값으로 매핑한다.
  const name = device?.nickname ?? '';
  // battery_level은 nullable. "정보 없음"을 0%로 왜곡하지 않도록 null을 그대로 둔다.
  const batteryLevel = device?.battery_level ?? null;
  const connectionStatus = isConnected
    ? CONNECTION_STATUS.CONNECTED
    : CONNECTION_STATUS.DISCONNECTED;

  return {
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
    registerErrorMessage: isCreateError
      ? DEVICE_MESSAGE.REGISTER_FAILED
      : undefined,
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
  };
};
