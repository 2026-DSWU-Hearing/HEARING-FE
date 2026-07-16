import { useEffect, useState } from 'react';

import { DEVICE_CONNECT_TIMEOUT_MS } from '@/shared/constants/deviceConnection';

/**
 * 기기 등록 후 ESP32가 서버에 접속하기를 기다리는 상태를 관리하는 훅.
 * 설정 페이지와 온보딩에서 공유한다.
 *
 * 서버 응답만으로는 "방금 등록해 기다리는 중"과 "예전에 등록했는데 기기가 꺼진 상태"를
 * 구분할 수 없다(둘 다 is_connected: false). 그래서 등록 시각을 프론트가 들고 있는다.
 *
 * 조회는 호출부의 책임으로 남기고 isConnected만 받는다.
 * 폴링 주기가 화면마다 다르기 때문이다(온보딩은 즉각 반응이 필요해 1초, 설정은 5초).
 *
 * @param isConnected 서버가 알려준 현재 연결 여부
 */
export const useDeviceConnectionWait = (isConnected: boolean) => {
  // null이면 대기 중이 아니다(등록한 적 없거나, 이미 연결됐거나, 예전에 등록한 기기).
  const [registeredAt, setRegisteredAt] = useState<number | null>(null);
  const [isTimedOut, setIsTimedOut] = useState(false);

  // 대기 시간을 초과하면 실패로 전환한다. 무한 대기로 사용자가 갇히는 것을 막는다.
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
  const isWaiting = registeredAt !== null && !isTimedOut && !isConnected;
  const isTimedOutWaiting = isTimedOut && !isConnected;

  /** 대기를 시작한다. 등록 성공 시점에 호출한다. */
  const startWaiting = () => {
    setRegisteredAt(Date.now());
    setIsTimedOut(false);
  };

  /** 대기를 초기화한다. 기기 삭제 등 대기 자체가 무의미해진 시점에 호출한다. */
  const resetWaiting = () => {
    setRegisteredAt(null);
    setIsTimedOut(false);
  };

  return {
    /** 연결을 기다리는 중 */
    isWaiting,
    /** 대기 시간을 초과했고 아직 연결되지 않음 */
    isTimedOutWaiting,
    startWaiting,
    /** 재시도. 등록은 이미 성공했으므로 타이머만 다시 돌린다. */
    retryWaiting: startWaiting,
    resetWaiting,
  };
};
