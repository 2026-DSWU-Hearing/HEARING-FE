import { useEffect } from 'react';

import { onForegroundMessage } from '@/shared/firebase/settingFCM';

export const useForegroundNotification = () => {
  useEffect(() => {
    const unsubscribe = onForegroundMessage((payload) => {
      if (Notification.permission !== 'granted') return;

      const title = payload.data?.title ?? payload.notification?.title ?? '알림';
      const body = payload.data?.body ?? payload.notification?.body;
      const options: NotificationOptions = {
        body,
        icon: '/icons/android-chrome-192x192.png',
      };

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
          .then((registration) => registration.showNotification(title, options))
          .catch((error) => {
            console.error('[FCM] 포그라운드 알림 생성 실패:', error);
          });
        return;
      }

      try {
        const notification = new Notification(title, options);
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      } catch (error) {
        console.error('[FCM] 포그라운드 알림 생성 실패:', error);
      }
    });

    return unsubscribe;
  }, []);
};
