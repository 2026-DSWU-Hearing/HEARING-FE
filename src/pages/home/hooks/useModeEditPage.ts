import { useEffect, useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import type { ModeFormSubmitDataTypes } from '@/pages/home/components/modeForm/ModeFormContext';
import { MAX_MODE_NAME_LENGTH } from '@/pages/home/components/modeForm/ModeFormContext';
import {
  MODE_EDIT_ERROR_MESSAGE,
  MODE_MESSAGE,
} from '@/pages/home/constants/modeMessages';
import { useDeleteMode } from '@/pages/home/hooks/useDeleteMode';
import { useGetModeDetail } from '@/pages/home/hooks/useGetModeDetail';
import { useGetModes } from '@/pages/home/hooks/useGetModes';
import { usePatchActivateMode } from '@/pages/home/hooks/usePatchActivateMode';
import { usePutMode } from '@/pages/home/hooks/usePutMode';
import { useModal } from '@/shared/hooks/useModal';

// 에러 메시지 변환
const getModeEditErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    if (error.response?.status === 400) {
      return MODE_EDIT_ERROR_MESSAGE.BAD_REQUEST;
    }

    if (error.response?.status === 404) {
      return MODE_EDIT_ERROR_MESSAGE.NOT_FOUND;
    }

    if (error.response?.status === 409) {
      return MODE_EDIT_ERROR_MESSAGE.CONFLICT;
    }
  }

  return MODE_EDIT_ERROR_MESSAGE.DEFAULT;
};

// 모드 수정 페이지에서 필요한 데이터 조회 + 수정/삭제 제출 로직을 한 곳에 모은 커스텀 훅
export const useModeEditPage = () => {
  const { modeId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const deletedModeIdRef = useRef<number | null>(null);
  const parsedModeId = Number(modeId);
  const isValidModeId = Number.isInteger(parsedModeId);
  const [errorMessage, setErrorMessage] = useState('');
  // 삭제 확인 모달의 열림/닫힘 상태
  const deleteConfirmModal = useModal();
  // 활성 모드 삭제 시 "다른 모드로 전환 후 삭제" 안내 모달의 열림/닫힘 상태
  const activateDeleteModal = useModal();
  const {
    data: modeDetailData,
    isLoading: isModeDetailLoading,
    isError: isModeDetailError,
  } = useGetModeDetail(isValidModeId ? parsedModeId : null);
  const {
    data: modesData,
    isLoading: isModesLoading,
    isError: isModesError,
  } = useGetModes();
  const { mutateAsync: updateMode, isPending: isUpdatingMode } = usePutMode();
  const { mutateAsync: deleteMode, isPending: isDeletingMode } =
    useDeleteMode();
  const { mutateAsync: activateMode, isPending: isActivatingMode } =
    usePatchActivateMode();

  // 현재 보고 있는 모드가 활성 모드인지 (modes 목록의 is_active 기준)
  const currentMode = modesData?.modes.find(
    (mode) => mode.mode_id === parsedModeId,
  );
  const isCurrentModeActive = currentMode?.is_active ?? false;

  // 활성 모드를 삭제할 때 대신 활성화할 모드(삭제 대상을 제외한 첫 번째).
  // 안내 모달 메시지와 실제 삭제 로직이 동일한 대상을 쓰도록 한 곳에서 계산한다.
  const nextActiveMode = modesData?.modes.find(
    (mode) => mode.mode_id !== parsedModeId,
  );

  // 목록 조회가 끝나지 않았거나 실패하면 삭제 가능 여부(개수·활성 상태)를 판단할 수 없다.
  const isModesReady = !isModesLoading && !isModesError && Boolean(modesData);

  useEffect(() => {
    return () => {
      const deletedModeId = deletedModeIdRef.current;

      if (deletedModeId === null) return;

      queryClient.removeQueries({
        queryKey: ['modes', deletedModeId],
        exact: true,
      });
    };
  }, [queryClient]);

  const handleModeUpdateSubmit = async ({
    name,
    icon,
    // soundIds는 생성 폼 전용이다. 수정 페이지는 기존 소리 목록을 그대로 유지하므로 사용하지 않는다.
  }: ModeFormSubmitDataTypes) => {
    if (!modeDetailData) return;

    const trimmedName = name.trim();

    if (!trimmedName) {
      setErrorMessage(MODE_MESSAGE.EMPTY_NAME);
      return;
    }

    if (trimmedName.length > MAX_MODE_NAME_LENGTH) {
      setErrorMessage(MODE_MESSAGE.TOO_LONG_NAME);
      return;
    }

    try {
      await updateMode({
        modeId: parsedModeId,
        modeData: {
          name: trimmedName,
          icon,
          // 이름과 아이콘만 수정해도 기존 소리 목록은 함께 보내서 서버 상태를 유지한다.
          sounds: modeDetailData.sounds.map((sound) => ({
            sound_id: sound.sound_id,
            name: sound.name,
          })),
        },
      });
      navigate('/');
    } catch (error) {
      setErrorMessage(getModeEditErrorMessage(error));
    }
  };

  // 삭제 버튼 클릭: 최소 개수 검증 후, 활성 모드면 전환 안내 모달을, 아니면 삭제 확인 모달을 연다.
  const handleModeDeleteClick = () => {
    // 목록이 준비되지 않으면 개수·활성 상태를 신뢰할 수 없으므로 삭제를 막는다.
    if (!modeDetailData || !isModesReady) return;

    if ((modesData?.modes.length ?? 0) <= 1) {
      setErrorMessage(MODE_MESSAGE.MIN_MODE_COUNT);
      return;
    }

    if (isCurrentModeActive) {
      activateDeleteModal.open();
      return;
    }

    deleteConfirmModal.open();
  };

  // 확인 모달에서 "확인"을 눌렀을 때 실제 삭제를 수행한다.
  const handleModeDeleteConfirm = async () => {
    try {
      await deleteMode(parsedModeId);
      deletedModeIdRef.current = parsedModeId;
      navigate('/', { replace: true });
    } catch (error) {
      setErrorMessage(getModeEditErrorMessage(error));
    }
  };

  // 활성 모드 전환 안내 모달에서 "확인": 다른 모드를 활성화한 뒤 현재 모드를 삭제한다.
  // 활성화와 삭제를 분리해, 활성화는 됐는데 삭제만 실패한 "부분 성공" 상태를 구분한다.
  const handleActiveModeDeleteConfirm = async () => {
    if (!nextActiveMode) return;
    // 확인을 누른 시점에 안내 모달을 먼저 닫는다.
    // 부분 성공(활성화 O, 삭제 X) 시 "전환 후 삭제할까요?" 메시지가 잘못 남는 것을 방지한다.
    activateDeleteModal.close();

    // 1단계: 다른 모드 활성화. 실패하면 서버 상태가 그대로이므로 일반 에러로 처리한다.
    try {
      await activateMode(nextActiveMode.mode_id);
    } catch (error) {
      setErrorMessage(getModeEditErrorMessage(error));
      return;
    }

    // 2단계: 현재 모드 삭제. 여기서 실패하면 다른 모드는 이미 활성화된 부분 성공 상태다.
    // 목록 캐시를 무효화해 화면을 서버 실제 상태와 다시 맞추고, 전용 안내를 띄운다.
    try {
      await deleteMode(parsedModeId);
      deletedModeIdRef.current = parsedModeId;
      navigate('/', { replace: true });
    } catch {
      queryClient.invalidateQueries({ queryKey: ['modes'] });
      setErrorMessage(MODE_MESSAGE.ACTIVE_DELETE_PARTIAL_FAIL);
    }
  };

  const clearErrorMessage = () => setErrorMessage('');

  return {
    modeDetailData,
    errorMessage,
    isValidModeId,
    isModeDetailLoading,
    isModeDetailError,
    isUpdatingMode,
    // 삭제 또는 다른 모드 활성화가 진행 중이면 버튼을 비활성화한다.
    isDeletingMode: isDeletingMode || isActivatingMode,
    isDeleteConfirmOpen: deleteConfirmModal.isOpen,
    isActivateDeleteOpen: activateDeleteModal.isOpen,
    activeDeleteMessage: MODE_MESSAGE.ACTIVE_DELETE_CONFIRM(
      modeDetailData?.name ?? '',
      nextActiveMode?.name ?? '',
    ),
    // 목록 미준비 시 삭제 버튼을 비활성화하기 위해 노출한다.
    isModesReady,
    handleModeUpdateSubmit,
    handleModeDeleteClick,
    handleModeDeleteConfirm,
    handleActiveModeDeleteConfirm,
    closeDeleteConfirm: deleteConfirmModal.close,
    closeActivateDelete: activateDeleteModal.close,
    clearErrorMessage,
  };
};
