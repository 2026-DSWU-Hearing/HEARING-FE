import { useCallback, useEffect, useState } from 'react';

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
 * @param startsImmediately 마운트하자마자 대기를 시작할지 여부.
 *   온보딩의 연결 대기 페이지처럼 "이 화면에 온 것 자체가 등록 성공"인 경우에 쓴다.
 *
 *   ⚠️ 마운트 시점에만 평가된다. 이후 이 값이 false → true로 바뀌어도 대기가 시작되지 않으므로
 *   반드시 상수로만 넘길 것. 사용자 동작에 따라 대기를 시작해야 한다면
 *   (설정 페이지처럼 같은 화면에서 등록하는 경우) 이 옵션 대신 startWaiting()을 직접 호출한다.
 */
export const useDeviceConnectionWait = (
  isConnected: boolean,
  startsImmediately = false,
) => {
  // null이면 대기 중이 아니다(등록한 적 없거나, 이미 연결됐거나, 예전에 등록한 기기).
  // lazy initializer로 넘겨 Date.now()가 첫 렌더에만 실행되게 한다(렌더는 순수해야 한다).
  const [registeredAt, setRegisteredAt] = useState<number | null>(() =>
    startsImmediately ? Date.now() : null,
  );
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
  // 두 값 모두 registeredAt을 확인해, 대기를 시작한 적 없으면 어느 쪽도 참이 되지 않음을
  // 이 자리에서 바로 드러낸다.
  const isWaiting = registeredAt !== null && !isTimedOut && !isConnected;
  const isTimedOutWaiting = registeredAt !== null && isTimedOut && !isConnected;

  /** 대기를 시작한다. 등록 성공 시점에 호출한다. */
  const startWaiting = useCallback(() => {
    setRegisteredAt(Date.now());
    setIsTimedOut(false);
  }, []);

  /** 대기를 초기화한다. 기기 삭제 등 대기 자체가 무의미해진 시점에 호출한다. */
  const resetWaiting = useCallback(() => {
    setRegisteredAt(null);
    setIsTimedOut(false);
  }, []);

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
