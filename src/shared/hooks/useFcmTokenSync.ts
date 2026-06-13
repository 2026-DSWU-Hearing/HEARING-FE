import { useEffect } from 'react';

import { postFcmToken } from '@/shared/apis/postFcmToken';
import { getCurrentFcmToken } from '@/shared/firebase/settingFCM';

export const useFcmTokenSync = () => {
  useEffect(() => {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;

    let isCancelled = false;

    const syncFcmToken = async () => {
      const fcmToken = await getCurrentFcmToken();
      if (isCancelled || !fcmToken) return;

      try {
        await postFcmToken(fcmToken);
      } catch (error) {
        console.error('[FCM] token sync failed:', error);
      }
    };

    void syncFcmToken();

    return () => {
      isCancelled = true;
    };
  }, []);
};
