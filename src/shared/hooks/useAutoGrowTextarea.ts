import { useLayoutEffect, useRef } from 'react';

// 채팅 입력 버블(ChatInputBubble, ListeningBubble)에서 공통으로 쓰는 훅.
// textarea 자체에는 패딩을 주지 않고(패딩은 감싸는 버블 wrapper의 CSS padding이 담당),
// 화면 밖에 숨겨둔 span으로 현재 텍스트의 실제 렌더링 폭만 재서 그 값을 textarea width로 지정한다.
// 이렇게 하면 버블의 좌우/상하 여백은 항상 wrapper의 padding 값 그대로 대칭을 이룬다.
// 최종 하한은 wrapper에 걸어둔 min-w 클래스가 잡아주는데, 이 값이 실제 측정폭보다 크면
// 그만큼 남는 공간이 justify-content 방향으로 쏠려서 한쪽 패딩만 넓어 보이게 되므로
// min-w는 최소한으로만 잡고 실제 크기는 이 훅의 측정값에 맡긴다.
export const useAutoGrowTextarea = (value: string, placeholder: string) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    // document.fonts.ready는 비동기라서, 그 전에 컴포넌트가 언마운트되면 이미 사라진
    // DOM에 스타일을 넣으려는 시도가 될 수 있다. active 플래그로 언마운트 이후 실행을 막는다.
    let active = true;

    const textarea = textareaRef.current;
    const measure = measureRef.current;
    if (!textarea || !measure) return;

    const remeasure = () => {
      if (!active) return;

      measure.textContent = value || placeholder;
      // 측정용 span은 순수 글자 폭만 재기 때문에, 실제 textarea에서 커서(caret)가 앉을
      // 자리가 없어서 마지막 글자가 다음 줄로 밀려나 버린다. 여유폭을 살짝 더해준다.
      textarea.style.width = `${measure.offsetWidth + 6}px`;

      // 너비가 바뀌면 줄바꿈되는 위치도 달라지므로, height는 width를 반영한 뒤에 재야
      // scrollHeight가 정확하다. 순서를 바꾸면 이전 너비 기준의 줄 수로 계산돼 버린다.
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    // 렌더 직후(페인트 전) 바로 한 번 측정해서 크기가 튀는 게 안 보이게 한다.
    remeasure();

    // Pretendard 폰트가 늦게 로드되면 그 전엔 대체 폰트 기준으로 측정돼서 폭이 부정확할 수 있다.
    // 폰트 로드가 끝나면 실제 폭 기준으로 한 번 더 재측정한다.
    // 일부 WebView/구형 브라우저에는 document.fonts(CSS Font Loading API)가 없어서
    // 바로 접근하면 런타임 에러가 난다. PWA/모바일 환경을 고려해 optional chaining으로 가드한다.
    document.fonts?.ready?.then(() => {
      remeasure();
    });

    return () => {
      active = false;
    };
  }, [value, placeholder]);

  return { textareaRef, measureRef };
};
