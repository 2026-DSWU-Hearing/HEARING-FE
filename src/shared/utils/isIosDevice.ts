/**
 * iPhone·iPad(iPadOS 13+ 데스크톱 UA 포함) 판별.
 * iOS WebKit 전용 우회 코드(입력 자동 확대 방지, 키보드 뷰포트 복구 등)의 공통 가드.
 */
export const isIosDevice = (): boolean => {
  const { userAgent, platform, maxTouchPoints } = navigator;
  // iPadOS 13+는 데스크톱 UA를 쓰므로 platform + 터치 지원으로 추가 판별한다.
  const isIpadOs = platform === 'MacIntel' && maxTouchPoints > 1;
  return /iPad|iPhone|iPod/.test(userAgent) || isIpadOs;
};
