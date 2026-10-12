import { isIosDevice } from '@/shared/utils/isIosDevice';

/**
 * iOS Safari는 입력 요소의 글자 크기가 16px보다 작으면 포커스 시 화면을 자동 확대한다.
 * viewport에 `maximum-scale=1`을 주면 이 자동 확대가 멈춘다.
 *
 * 단, Android는 `maximum-scale=1`이 핀치 확대까지 막아 버리므로 전역 meta에 박지 않고
 * iOS로 판별된 기기에서만 런타임에 추가한다. (iOS는 접근성 정책상 핀치 확대를 막지 않는다.)
 */
export const preventIosInputZoom = () => {
  if (!isIosDevice()) return;

  const viewportMeta = document.querySelector<HTMLMetaElement>(
    'meta[name="viewport"]',
  );
  if (!viewportMeta) return;

  viewportMeta.content = `${viewportMeta.content}, maximum-scale=1`;
};
