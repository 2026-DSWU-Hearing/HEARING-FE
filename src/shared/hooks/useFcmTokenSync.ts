import { useEffect } from 'react';

import { postFcmToken } from '@/shared/apis/postFcmToken';
import { getCurrentFcmToken } from '@/shared/firebase/settingFCM';
import { getAccessToken } from '@/pages/login/utils/tokenStorage';

export const useFcmTokenSync = () => {
  useEffect(() => {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
    // 로그인 전(토큰 없음)에는 서버에 등록하지 않는다. 만료/무효 토큰으로 호출하면
    // 401이 나고 인터셉터가 로그인으로 리다이렉트시키므로, 애초에 두드리지 않는다.
    if (!getAccessToken()) return;

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
