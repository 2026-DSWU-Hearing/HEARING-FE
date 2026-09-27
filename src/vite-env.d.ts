/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_APP_BASE_URL: string;
  readonly VITE_FIREBASE_VAPID_KEY: string;
  readonly VITE_KAKAO_JS_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
