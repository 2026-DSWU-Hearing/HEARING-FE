/* eslint-disable no-undef */
// 이 파일은 Service Worker로 동작하므로 번들러(Vite)를 거치지 않는 정적 파일이다.
// 따라서 import.meta.env / ES module import를 쓸 수 없고, compat SDK를 importScripts로 불러온다.
// SDK 버전은 package.json의 firebase 버전(12.14.0)과 반드시 일치시킨다.
importScripts('https://www.gstatic.com/firebasejs/12.14.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.14.0/firebase-messaging-compat.js');

// SW는 환경변수를 읽지 못하므로 config를 하드코딩한다.
// Firebase 웹 config는 클라이언트 식별자이며 공개되어도 보안상 문제없다.
firebase.initializeApp({
  apiKey: 'AIzaSyA595WdrcLDjSbRs8Z027MvvUpPaUV-Tz0',
  authDomain: 'hearing-18944.firebaseapp.com',
  projectId: 'hearing-18944',
  storageBucket: 'hearing-18944.firebasestorage.app',
  messagingSenderId: '931196004064',
  appId: '1:931196004064:web:e0da310d3c73ea3b235285',
});

const messaging = firebase.messaging();

// 앱이 백그라운드(탭 비활성/닫힘) 상태일 때 도착하는 푸시 메시지를 처리한다.
messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification ?? {};
  self.registration.showNotification(title ?? '알림', {
    body,
    icon: '/icons/android-chrome-192x192.png',
  });
});
