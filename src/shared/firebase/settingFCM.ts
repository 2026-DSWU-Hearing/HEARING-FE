// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
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

// FCM 백그라운드 SW의 scope. PWA용 sw.js(scope '/')와 충돌하지 않도록 분리한다.
// 등록(register)과 조회(getRegistration)가 반드시 같은 값을 써야 하므로 상수로 공유한다.
export const FCM_SW_SCOPE = '/firebase-cloud-messaging-push-scope';

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
    scope: FCM_SW_SCOPE,
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

// 비보안 컨텍스트나 일부 인앱 브라우저엔 Notification API 자체가 없다.
export const isNotificationSupported = () => typeof Notification !== 'undefined';

// 알림은 선택 기능이므로 권한 요청이 실패해도 호출부로 예외를 던지지 않는다.
export const requestFcmToken = async (): Promise<string | null> => {
  if (!isNotificationSupported()) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;

    return getCurrentFcmToken();
  } catch (error) {
    console.error('[FCM] 알림 권한 요청 실패:', error);
    return null;
  }
};
