import { useEffect } from 'react';
import { onMessage } from 'firebase/messaging';

import { messaging } from '@/shared/firebase/settingFCM';
import { useToast } from '@/shared/components/toast/ToastContext';

import type { DetectionDirectionTypes } from '@/shared/types/detectionTypes';

// 서버가 FCM data에 싣는 키(docs/api-spec.md·백엔드 push_service 기준). 값은 전부 문자열이다.
interface DetectionPushDataTypes {
  sound_name?: string;
  sound_category?: string;
  direction?: string;
}

// 앱이 포그라운드일 때 도착한 FCM 푸시를 인앱 토스트로 띄운다.
//
// Firebase SW SDK는 보이는 창이 있으면 배너(showNotification)를 띄우지 않고 그 창으로 메시지를 넘기며,
// 그 메시지가 여기 onMessage로 들어온다. 즉 배너와 이 토스트는 둘 중 하나만 발생한다.
// (iOS 홈 화면 앱은 SW가 창을 찾지 못해 배너 쪽으로 가므로 이 훅은 주로 Android/PC에서 동작한다.)
export const useFcmForegroundMessage = () => {
  const { showToast } = useToast();

  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      const { sound_name, sound_category, direction } = (payload.data ??
        {}) as DetectionPushDataTypes;
      if (!sound_name || !sound_category) return;

      showToast({
        soundName: sound_name,
        categoryName: sound_category,
        // 모르는 값은 getDirectionLabel이 null(미표시)로 처리하므로 문자열을 그대로 넘긴다.
        direction: (direction ?? 'UNKNOWN') as DetectionDirectionTypes,
      });
    });

    return unsubscribe;
  }, [showToast]);
};
