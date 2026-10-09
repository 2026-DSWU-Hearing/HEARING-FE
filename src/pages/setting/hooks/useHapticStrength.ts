import { useEffect, useRef, useState } from 'react';

import { useGetUsers } from '@/shared/hooks/useGetUsers';
import { usePatchHaptic } from '@/pages/setting/hooks/usePatchHaptic';
import {
  HAPTIC_MESSAGE,
  HAPTIC_SAVE_DEBOUNCE_MS,
} from '@/pages/setting/constants/hapticMessages';

/**
 * 진동 강도 슬라이더의 값·저장 로직을 모은 커스텀 훅.
 *
 * 저장은 세 가지 규칙으로 화면과 서버가 어긋나지 않게 한다.
 * 1. 디바운스: 확정값이 연달아 들어오면 마지막 값 하나만 보낸다.
 * 2. 직렬화: 요청이 진행 중이면 새 값을 대기시켰다가 끝난 뒤 보낸다.
 *    (동시에 여러 PATCH가 나가면 응답 순서가 뒤섞여 서버가 중간값으로 남는다)
 * 3. 실패 복구: 저장에 실패하면 마지막으로 저장 확인된 값으로 슬라이더를 되돌리고 안내한다.
 */
export const useHapticStrength = () => {
  const { data: user, isLoading } = useGetUsers();
  const { mutateAsync: updateHaptic } = usePatchHaptic();

  const [hapticStrength, setHapticStrength] = useState(0);
  const [saveErrorMessage, setSaveErrorMessage] = useState('');

  // 서버에 저장된 것으로 확인된 마지막 값. 실패 시 되돌릴 기준.
  const savedStrengthRef = useRef<number | null>(null);
  // 아직 보내지 않은 최신 확정값(디바운스 대기 중이거나 앞선 요청 완료 대기 중).
  const pendingStrengthRef = useRef<number | null>(null);
  const isSavingRef = useRef(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 조회한 저장값으로 슬라이더 초기값을 한 번만 채운다(드래그 중 덮어쓰기 방지).
  const isInitialized = useRef(false);
  useEffect(() => {
    if (isInitialized.current || !user) {
      return;
    }

    setHapticStrength(user.haptic_strength);
    savedStrengthRef.current = user.haptic_strength;
    isInitialized.current = true;
  }, [user]);

  // 대기 중인 값을 하나 꺼내 저장한다. 진행 중이면 아무것도 하지 않고,
  // 완료 후 다시 호출돼 그 사이 쌓인 최신 값을 이어서 보낸다.
  const flushPendingStrength = async () => {
    if (isSavingRef.current) return;

    const value = pendingStrengthRef.current;
    pendingStrengthRef.current = null;
    if (value === null || value === savedStrengthRef.current) return;

    isSavingRef.current = true;
    try {
      const updatedUser = await updateHaptic({ haptic_strength: value });
      savedStrengthRef.current = updatedUser.haptic_strength;
      setSaveErrorMessage('');
    } catch {
      // 뒤이어 보낼 값이 있으면 그 값으로 재시도되므로, 없을 때만 되돌린다.
      if (
        pendingStrengthRef.current === null &&
        savedStrengthRef.current !== null
      ) {
        setHapticStrength(savedStrengthRef.current);
      }
      setSaveErrorMessage(HAPTIC_MESSAGE.SAVE_FAILED);
    } finally {
      isSavingRef.current = false;
      void flushPendingStrength();
    }
  };

  // 드래그 중: 화면만 즉시 갱신한다.
  const handleStrengthChange = (value: number) => {
    setHapticStrength(value);
  };

  // 드래그 종료/키보드 입력: 확정값을 대기열에 두고 디바운스 후 저장한다.
  const handleStrengthChangeEnd = (value: number) => {
    pendingStrengthRef.current = value;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      debounceTimerRef.current = null;
      void flushPendingStrength();
    }, HAPTIC_SAVE_DEBOUNCE_MS);
  };

  // 디바운스 대기 중에 화면을 떠나면 마지막 값을 잃지 않도록 즉시 보낸다.
  useEffect(() => {
    return () => {
      if (!debounceTimerRef.current) return;

      clearTimeout(debounceTimerRef.current);
      const value = pendingStrengthRef.current;
      if (value !== null && value !== savedStrengthRef.current) {
        void updateHaptic({ haptic_strength: value }).catch(() => {});
      }
    };
  }, [updateHaptic]);

  return {
    hapticStrength,
    saveErrorMessage,
    isLoading,
    handleStrengthChange,
    handleStrengthChangeEnd,
  };
};
