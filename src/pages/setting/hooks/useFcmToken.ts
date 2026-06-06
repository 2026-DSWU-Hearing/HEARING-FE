import { useState, useCallback, useEffect } from 'react';

import { postFcmToken } from '@/pages/setting/apis/postFcmToken';
import { requestFcmToken, onForegroundMessage } from '@/shared/firebase/settingFCM';

const getInitialPermission = (): NotificationPermission =>
  typeof Notification !== 'undefined' ? Notification.permission : 'default';

export const useFcmToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>(getInitialPermission);

  // 사용자 제스처(버튼 클릭)에서 호출해야 한다. 브라우저는 자동 권한 요청을 막는다.
  const handleRequestPermission = useCallback(async () => {
    const fcmToken = await requestFcmToken();
    setPermission(Notification.permission);

    if (!fcmToken) return;
    setToken(fcmToken);

    // 발급받은 토큰을 서버에 등록한다. 전송 실패해도 토큰 표시는 유지한다.
    try {
      await postFcmToken(fcmToken);
    } catch (error) {
      console.error('[FCM] 토큰 서버 전송 실패:', error);
    }
  }, []);

  // foreground 메시지는 OS 알림을 자동으로 띄우지 않으므로 직접 Notification을 생성한다.
  useEffect(() => {
    const unsubscribe = onForegroundMessage((payload) => {
      const { title, body } = payload.notification ?? {};
      if (Notification.permission === 'granted' && title) {
        new Notification(title, { body, icon: '/icons/android-chrome-192x192.png' });
      }
    });

    return () => unsubscribe();
  }, []);

  return { token, permission, handleRequestPermission };
};
