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
// 백엔드는 data-only 페이로드를 보낸다(notification 키 없음). data-only는 브라우저가
// 알림을 자동 표시하지 않으므로 여기서 직접 showNotification으로 띄운다.
// 이렇게 해야 중복 표시(자동 1개 + 수동 1개)가 생기지 않고, notificationclick 핸들러도 항상 동작한다.
messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.data ?? {};
  self.registration.showNotification(title ?? '알림', {
    body,
    icon: '/icons/android-chrome-192x192.png',
  });
});

// 사용자가 알림을 클릭하면 앱을 연다.
// 이미 열린 앱 탭이 있으면 그 탭에 focus하고, 없으면 새 창을 연다.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // waitUntil로 SW가 작업을 끝낼 때까지 살아있게 한다(안 하면 중간에 종료될 수 있다).
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // 이 origin으로 이미 열린 탭이 있으면 새로 열지 않고 그 탭을 포커스한다.
      // startsWith로 검사해 URL 시작이 정확히 이 origin인 탭만 매칭한다(includes는 중간에 끼어도 매칭됨).
      const existingClient = clientList.find((client) => client.url.startsWith(self.location.origin));
      if (existingClient) return existingClient.focus();
      return self.clients.openWindow('/');
    }),
  );
});
