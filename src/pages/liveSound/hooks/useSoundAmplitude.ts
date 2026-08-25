import { useEffect, useRef } from 'react';

import { AMPLITUDE_SMOOTHING_FACTOR } from '../constants/audioConfig';

// 링이 읽는 CSS 변수 이름. 이 훅과 LiveSoundAnimation만 아는 계약이다.
const AMPLITUDE_CSS_VARIABLE = '--amp';

// 소수점을 이 자리까지만 쓴다. rAF마다 스타일 문자열이 바뀌면 브라우저가 매번
// 스타일을 다시 계산하는데, 눈에 보이지도 않는 뒷자리 변화까지 반영할 이유가 없다.
const AMPLITUDE_DECIMAL_PLACES = 3;

// 마이크 음량을 컨테이너의 --amp CSS 변수로 흘려보낸다.
//
// 값을 state로 두지 않는 것이 이 훅의 핵심이다. rAF는 초당 60회 도는데 그때마다
// setState를 하면 페이지 전체가 초당 60번 리렌더된다. 이 화면은 동시에 마이크를
// 캡처하고 WebSocket을 열어두기 때문에 그 비용을 감당할 수 없다.
//
// 링 하나하나의 ref를 잡는 대신 컨테이너의 CSS 변수 하나만 갱신하는 이유:
// 링이 몇 개인지, 각자 어떻게 반응하는지를 이 훅이 몰라도 된다. 링을 더하거나
// 반응 곡선을 바꿔도 여기는 그대로다.
export const useSoundAmplitude = (getAmplitude: (() => number) | null) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // 콜백 identity가 바뀌어도 rAF 루프를 다시 만들지 않도록 최신 값만 참조한다.
  // (루프를 재생성하면 평활화된 값이 리셋돼 링이 튄다.)
  const getAmplitudeRef = useRef(getAmplitude);
  useEffect(() => {
    getAmplitudeRef.current = getAmplitude;
  });

  // 감지가 켜졌는지만 보고 루프를 켜고 끈다. 함수 identity가 아니라 유무로 판단해야
  // 매 렌더마다 새 함수가 와도 루프가 유지된다.
  const isCapturing = getAmplitude !== null;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 감지 중이 아니면 루프를 돌리지 않는다. 마지막 값이 남아 링이 커진 채
    // 굳어 있지 않도록 0으로 되돌린다.
    if (!isCapturing) {
      container.style.setProperty(AMPLITUDE_CSS_VARIABLE, '0');
      return;
    }

    let animationFrameId = 0;
    let smoothedAmplitude = 0;

    const updateAmplitude = () => {
      const rawAmplitude = getAmplitudeRef.current?.() ?? 0;

      // EMA. 원값은 프레임마다 심하게 튀어서 그대로 쓰면 링이 경련하듯 떨린다.
      smoothedAmplitude =
        smoothedAmplitude * AMPLITUDE_SMOOTHING_FACTOR +
        rawAmplitude * (1 - AMPLITUDE_SMOOTHING_FACTOR);

      container.style.setProperty(
        AMPLITUDE_CSS_VARIABLE,
        smoothedAmplitude.toFixed(AMPLITUDE_DECIMAL_PLACES),
      );

      animationFrameId = requestAnimationFrame(updateAmplitude);
    };

    animationFrameId = requestAnimationFrame(updateAmplitude);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.style.setProperty(AMPLITUDE_CSS_VARIABLE, '0');
    };
  }, [isCapturing]);

  return containerRef;
};
