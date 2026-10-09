import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

import { rtzrMockBackend } from './vite/rtzrMockBackend.ts';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    // RTZR 실시간 STT용 목 백엔드(dev 서버 전용).
    // 토큰 발급 + WebSocket 중계를 담당한다. 실제 백엔드가 준비되면 제거한다.
    rtzrMockBackend(),
    VitePWA({
      registerType: 'autoUpdate',
      // dev 환경에서도 PWA SW를 활성화해 FCM SW와의 2-SW 공존을 검증할 수 있게 한다.
      devOptions: { enabled: true, type: 'module' },
      // FCM 전용 SW는 PWA precache 대상에서 제외한다(별도 scope로 직접 등록하므로).
      workbox: { globIgnores: ['**/firebase-messaging-sw.js'] },
      manifest: {
        name: 'Hearing',
        short_name: 'Hearing',
        description: '청각장애인을 위한 소리 감지 및 알림 서비스',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#21221e',
        theme_color: '#21221e',
        icons: [
          {
            src: '/icons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
