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
      if (Notification.permission !== 'granted' || !title) return;

      const notification = new Notification(title, {
        body,
        icon: '/icons/android-chrome-192x192.png',
      });

      // 포그라운드에서 만든 Notification은 onclick이 없으면 클릭해도 아무 동작이 없다.
      // 클릭 시 백그라운드로 가려진 탭을 다시 앞으로 가져온다.
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    });

    return () => unsubscribe();
  }, []);

  return { token, permission, handleRequestPermission };
};
