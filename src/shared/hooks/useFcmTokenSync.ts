import { useEffect, useState } from 'react';

import { postFcmToken } from '@/shared/apis/postFcmToken';
import { getCurrentFcmToken } from '@/shared/firebase/settingFCM';
import { getAccessToken } from '@/pages/login/utils/tokenStorage';

// 앱 시작 시 이 기기의 FCM 토큰을 서버에 등록한다.
// 반환하는 isFcmTokenSynced는 "지금 이 기기로 푸시가 실제로 올 수 있는지"의 근거로,
// App이 인앱 토스트를 FCM 경로에 맡길지(true) WS 토스트로 띄울지(false) 정할 때 쓴다.
export const useFcmTokenSync = () => {
  const [isFcmTokenSynced, setIsFcmTokenSynced] = useState(false);

  useEffect(() => {
    if (
      typeof Notification === 'undefined' ||
      Notification.permission !== 'granted'
    )
      return;
    // 로그인 전(토큰 없음)에는 서버에 등록하지 않는다. 만료/무효 토큰으로 호출하면
    // 401이 나고 인터셉터가 로그인으로 리다이렉트시키므로, 애초에 두드리지 않는다.
    if (!getAccessToken()) return;

    let isCancelled = false;

    const syncFcmToken = async () => {
      const fcmToken = await getCurrentFcmToken();
      if (isCancelled || !fcmToken) return;

      try {
        await postFcmToken(fcmToken);
        if (!isCancelled) setIsFcmTokenSynced(true);
      } catch (error) {
        console.error('[FCM] token sync failed:', error);
      }
    };

    void syncFcmToken();

    return () => {
      isCancelled = true;
    };
  }, []);

  return { isFcmTokenSynced };
};
