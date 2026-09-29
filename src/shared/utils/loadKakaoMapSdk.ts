import type { KakaoMapsTypes } from '@/shared/types/kakaoMapTypes';

const KAKAO_MAP_SDK_URL = 'https://dapi.kakao.com/v2/maps/sdk.js';
const SDK_LOAD_FAILED_MESSAGE = '카카오맵 SDK를 불러오지 못했습니다.';

let sdkPromise: Promise<KakaoMapsTypes> | null = null;

const createSdkPromise = () =>
  new Promise<KakaoMapsTypes>((resolve, reject) => {
    const loadedMaps = window.kakao?.maps;
    if (loadedMaps) {
      loadedMaps.load(() => resolve(loadedMaps));
      return;
    }

    const appKey = import.meta.env.VITE_KAKAO_JS_KEY;
    if (!appKey) {
      reject(new Error('VITE_KAKAO_JS_KEY가 설정되지 않았습니다.'));
      return;
    }

    const script = document.createElement('script');
    script.src = `${KAKAO_MAP_SDK_URL}?appkey=${appKey}&libraries=services&autoload=false`;
    script.async = true;

    script.onload = () => {
      const maps = window.kakao?.maps;
      if (!maps) {
        reject(new Error(SDK_LOAD_FAILED_MESSAGE));
        return;
      }

      maps.load(() => resolve(maps));
    };

    script.onerror = () => {
      script.remove();
      reject(new Error(SDK_LOAD_FAILED_MESSAGE));
    };

    document.head.appendChild(script);
  });

export const loadKakaoMapSdk = (): Promise<KakaoMapsTypes> => {
  if (!sdkPromise) {
    sdkPromise = createSdkPromise().catch((error: unknown) => {
      sdkPromise = null;
      throw error;
    });
  }

  return sdkPromise;
};
