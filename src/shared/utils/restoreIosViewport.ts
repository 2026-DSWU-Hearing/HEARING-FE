import { isIosDevice } from '@/shared/utils/isIosDevice';

/**
 * iOS 키보드가 닫힌 뒤 `position: fixed` 요소(하단 네비게이션)가 화면 중간에 떠 있는 상태를 되돌린다.
 *
 * iOS는 키보드가 열리면 입력창이 보이도록 비주얼 뷰포트를 밀어 올리는데, 입력창이 포커스된 채
 * 사라지거나(모달 닫기, 대화 종료로 textarea 언마운트) 바깥 탭으로 키보드가 닫히면 밀린 상태가
 * 그대로 남아 fixed 요소가 레이아웃 뷰포트 기준 위치(= 화면 중간)에 고정된다. 이후 사용자가
 * 스크롤해도 복구되지 않는 경우가 있어, 프로그램으로 스크롤 위치를 다시 써서 두 뷰포트를 맞춘다.
 *
 * - 유효 범위로 clamp한 현재 scrollY를 다시 적용한다. 밀린 만큼 넘어간 값이면 끝으로 당겨지고,
 *   정상 값이면 같은 위치라 화면은 그대로다(값이 같아도 iOS는 fixed 레이어를 다시 계산한다).
 */
const syncViewport = () => {
  const maxScrollY = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  const clampedScrollY = Math.min(window.scrollY, maxScrollY);
  window.scrollTo(window.scrollX, clampedScrollY);
};

const isTextField = (target: EventTarget | null) =>
  target instanceof HTMLInputElement ||
  target instanceof HTMLTextAreaElement ||
  (target instanceof HTMLElement && target.isContentEditable);

// 키보드 애니메이션이 끝난 뒤 보정해야 iOS가 값을 덮어쓰지 않는다.
const KEYBOARD_CLOSE_DELAY_MS = 300;

/**
 * 앱 시작 시 한 번 호출한다. iOS가 아니면 아무것도 하지 않는다.
 * 반환값은 리스너 해제 함수.
 */
export const restoreIosViewport = (): (() => void) => {
  if (!isIosDevice()) return () => {};

  let timer: ReturnType<typeof setTimeout> | null = null;
  const scheduleSync = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(syncViewport, KEYBOARD_CLOSE_DELAY_MS);
  };

  // 1) 입력창이 포커스를 잃을 때(키보드 닫힘). capture로 잡아 stopPropagation에 영향받지 않게 한다.
  const handleFocusOut = (event: FocusEvent) => {
    if (isTextField(event.target)) scheduleSync();
  };
  document.addEventListener('focusout', handleFocusOut, true);

  // 2) 포커스된 요소가 DOM에서 제거되면 focusout이 오지 않을 수 있다.
  //    비주얼 뷰포트 높이가 다시 커지는 순간(키보드 내려감)을 함께 본다.
  const { visualViewport } = window;
  let lastHeight = visualViewport?.height ?? window.innerHeight;
  const handleViewportResize = () => {
    if (!visualViewport) return;
    const isKeyboardClosed = visualViewport.height > lastHeight;
    lastHeight = visualViewport.height;
    if (isKeyboardClosed) scheduleSync();
  };
  visualViewport?.addEventListener('resize', handleViewportResize);

  return () => {
    if (timer) clearTimeout(timer);
    document.removeEventListener('focusout', handleFocusOut, true);
    visualViewport?.removeEventListener('resize', handleViewportResize);
  };
};
