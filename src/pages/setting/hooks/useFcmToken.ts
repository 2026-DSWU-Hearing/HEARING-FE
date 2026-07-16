import { useState, useCallback } from 'react';

import { postFcmToken } from '@/shared/apis/postFcmToken';
import { isNotificationSupported, requestFcmToken } from '@/shared/firebase/settingFCM';

const getCurrentPermission = (): NotificationPermission =>
  isNotificationSupported() ? Notification.permission : 'default';

export const useFcmToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>(getCurrentPermission);

  // 사용자 제스처(버튼 클릭)에서 호출해야 한다. 브라우저는 자동 권한 요청을 막는다.
  // 알림은 선택 기능이라 어떤 실패에도 예외를 던지지 않는다. 호출부의 흐름을 막지 않기 위함이다.
  const handleRequestPermission = useCallback(async () => {
    const fcmToken = await requestFcmToken();
    setPermission(getCurrentPermission());

    if (!fcmToken) return;
    setToken(fcmToken);

    // 발급받은 토큰을 서버에 등록한다. 전송 실패해도 토큰 표시는 유지한다.
    try {
      await postFcmToken(fcmToken);
    } catch (error) {
      console.error('[FCM] 토큰 서버 전송 실패:', error);
    }
  }, []);

  return { token, permission, handleRequestPermission };
};
