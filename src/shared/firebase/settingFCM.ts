// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import type { MessagePayload } from 'firebase/messaging';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA595WdrcLDjSbRs8Z027MvvUpPaUV-Tz0',
  authDomain: 'hearing-18944.firebaseapp.com',
  projectId: 'hearing-18944',
  storageBucket: 'hearing-18944.firebasestorage.app',
  messagingSenderId: '931196004064',
  appId: '1:931196004064:web:e0da310d3c73ea3b235285',
  measurementId: 'G-YLVZ0MSQYC',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// Firebase 콘솔 > Cloud Messaging > 웹 푸시 인증서에서 발급한 공개키
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

// 특정 Service Worker가 activated 상태가 될 때까지 기다린다.
// navigator.serviceWorker.ready는 scope '/'의 PWA SW만 보장하므로,
// 별도 scope로 등록한 FCM SW의 활성화는 이 registration의 SW를 직접 추적해야 한다.
const waitForServiceWorkerActivation = (registration: ServiceWorkerRegistration) => {
  const serviceWorker = registration.installing ?? registration.waiting ?? registration.active;
  if (!serviceWorker || serviceWorker.state === 'activated') return Promise.resolve();

  return new Promise<void>((resolve) => {
    serviceWorker.addEventListener('statechange', (event) => {
      if ((event.target as ServiceWorker).state === 'activated') resolve();
    });
  });
};

// FCM 백그라운드 알림용 Service Worker를 PWA용 sw.js와 다른 scope로 등록한다.
// scope를 분리해야 vite-plugin-pwa가 만든 sw.js(scope '/')와 충돌하지 않는다.
const registerFcmServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) return undefined;

  const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
    scope: '/firebase-cloud-messaging-push-scope',
  });

  // register()는 등록만 보장하고 활성화는 보장하지 않는다.
  // getToken의 push 구독은 active SW가 필요하므로 활성화될 때까지 기다린다.
  await waitForServiceWorkerActivation(registration);
  return registration;
};

// 알림 권한을 요청하고, 허용 시 FCM 토큰을 발급받는다.
// 토큰은 이 기기를 식별하는 주소로, 서버(또는 Firebase 콘솔)가 이 토큰으로 푸시를 보낸다.
export const getCurrentFcmToken = async (): Promise<string | null> => {
  try {
    if (!VAPID_KEY) {
      throw new Error('VITE_FIREBASE_VAPID_KEY가 설정되지 않았습니다.');
    }

    const serviceWorkerRegistration = await registerFcmServiceWorker();
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration,
    });

    return token ?? null;
  } catch (error) {
    // SW 등록 실패, VAPID 키 오류, 네트워크 문제 등으로 토큰 발급이 실패할 수 있다.
    console.error('[FCM] 토큰 발급 실패:', error);
    return null;
  }
};

export const requestFcmToken = async (): Promise<string | null> => {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return null;

  return getCurrentFcmToken();
};

// 앱이 foreground(탭 활성) 상태일 때 도착하는 메시지를 구독한다.
// 반환된 함수를 호출하면 구독이 해제된다.
export const onForegroundMessage = (callback: (payload: MessagePayload) => void) =>
  onMessage(messaging, callback);
