import type { KeyboardEvent } from 'react';

import { useAutoGrowTextarea } from '@/shared/hooks/useAutoGrowTextarea';

interface ListeningBubblePropTypes {
  isListening: boolean;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  // 반대쪽(ChatInputBubble)에 입력이 들어와서 이 버블이 그 아래에 새로 태어난 경우 true.
  // ChatContainer가 key를 바꿔 이 컴포넌트를 다시 mount시키므로, true일 때 등장 애니메이션만 틀어주면 된다.
  isSpawning: boolean;
  // 화면상 위/아래 순서(CSS order). DOM 순서는 항상 고정이고 이 값으로만 시각적 순서를 바꾼다.
  order: number;
}

// 대화의 다음 차례를 기다리는 왼쪽(상대방) 버블.
// 실제 STT 연동 전까지는 이 자리에 직접 텍스트를 입력해볼 수 있는 textarea로 동작한다.
// 오른쪽(ChatInputBubble)과 동일하게 Enter를 누르면 입력값을 확정 버블로 올리고 비운다.
// 버블의 패딩/모양은 바깥 wrapper가 담당하고, 안쪽 textarea는 패딩 없이 텍스트 폭만큼만
// 채워서 좌우/상하 여백이 항상 대칭이 되게 한다.
// 너비는 고정값이 아니라 입력된 텍스트 길이에 맞춰 늘어난다(useAutoGrowTextarea).
// 실제 STT 인식 결과가 도착하면(백엔드 연동 후) 이 자리 대신 확정된 ChatBubble로 쌓인다.
const ListeningBubble = ({
  isListening,
  value,
  onChange,
  onSubmit,
  isSpawning,
  order,
}: ListeningBubblePropTypes) => {
  const placeholder = isListening ? '듣는 중..' : '텍스트 입력';
  const { textareaRef, measureRef } = useAutoGrowTextarea(value, placeholder);

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // 한글 등 IME로 조합 중일 때 Enter를 누르면 조합 확정용 keydown이 한 번 더 발생해서,
    // 이걸 그대로 두면 같은 내용이 버블 두 개로 겹쳐 올라간다. 조합 중이면 무시한다.
    if (event.key !== 'Enter' || event.nativeEvent.isComposing) return;

    event.preventDefault();
    onSubmit();
  };

  return (
    // self-stretch: 부모(전체 컨테이너)의 align-items가 flex-start라 기본적으로는
    // 내용 너비만큼만 차지하는데, 그러면 이 안의 justify-start가 의미가 없어진다.
    // 이 줄만은 항상 전체 너비를 차지하도록 stretch로 고정한다.
    <div
      style={{ order }}
      className={`relative flex w-full justify-start self-stretch ${isSpawning ? 'animate-bubble-rise' : ''}`}
    >
      <div className="card-listening-bubble flex min-h-[1.75rem] min-w-[5.75rem] max-w-[75%] items-center justify-center gap-[0.625rem] overflow-hidden rounded-2xl rounded-bl-sm px-lg py-base">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="상대방 텍스트 입력"
          rows={1}
          className="heading-2xl-semibold max-w-full resize-none overflow-hidden border-none bg-transparent p-0 text-primary placeholder:text-primary outline-none"
        />
      </div>
      {/* 텍스트 실제 폭을 재기 위한 숨김 요소. 화면엔 보이지 않고 textarea와 같은 폰트 스타일만 공유한다. */}
      <span
        ref={measureRef}
        aria-hidden="true"
        className="heading-2xl-semibold invisible absolute left-0 top-0 -z-10 whitespace-pre"
      />
    </div>
  );
};

export default ListeningBubble;
