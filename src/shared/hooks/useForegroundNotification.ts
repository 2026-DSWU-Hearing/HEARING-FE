import { useEffect } from 'react';

import { FCM_SW_SCOPE, onForegroundMessage } from '@/shared/firebase/settingFCM';

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
        // 알림을 띄운 SW가 notificationclick 핸들러도 소유하므로, FCM SW(별도 scope)로 띄워야
        // 클릭 시 firebase-messaging-sw.js의 탭 포커스/앱 열기 로직이 실행된다.
        // serviceWorker.ready는 scope '/'의 PWA SW를 반환하므로 FCM scope를 직접 조회한다.
        navigator.serviceWorker
          .getRegistration(FCM_SW_SCOPE)
          .then((registration) => {
            if (registration) return registration.showNotification(title, options);
            // FCM SW registration을 못 찾으면 현재 페이지를 제어하는 SW로 fallback한다.
            return navigator.serviceWorker.ready.then((reg) => reg.showNotification(title, options));
          })
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
