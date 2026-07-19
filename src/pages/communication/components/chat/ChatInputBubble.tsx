import type { KeyboardEvent } from 'react';

import { useAutoGrowTextarea } from '@/shared/hooks/useAutoGrowTextarea';

interface ChatInputBubblePropTypes {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;

  isSpawning: boolean;
  // 화면상 위/아래 순서(CSS order). DOM 순서는 항상 고정이고 이 값으로만 시각적 순서를 바꾼다.
  order: number;
}

const PLACEHOLDER = '텍스트 입력';


const ChatInputBubble = ({
  value,
  onChange,
  onSubmit,
  isSpawning,
  order,
}: ChatInputBubblePropTypes) => {
  const { textareaRef, measureRef } = useAutoGrowTextarea(value, PLACEHOLDER);

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {

    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing)
      return;

    event.preventDefault();
    onSubmit();
  };

  return (

    <div
      style={{ order }}
      className={`relative flex w-full justify-end self-stretch ${isSpawning ? 'animate-bubble-rise' : ''}`}
    >
      <div className="flex min-h-[1.75rem] min-w-[5.75rem] max-w-[75%] items-center justify-center gap-[0.625rem] overflow-hidden rounded-2xl rounded-br-sm bg-primary-400 px-lg py-base">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDER}
          aria-label="답변 입력"
          rows={1}
          className="heading-2xl-semibold max-w-full resize-none overflow-hidden border-none bg-transparent p-0 text-right text-neutral-700 placeholder:text-neutral-700 outline-none"
        />
      </div>
  
      <span
        ref={measureRef}
        aria-hidden="true"
        className="heading-2xl-semibold invisible absolute left-0 top-0 -z-10 whitespace-pre"
      />
    </div>
  );
};

export default ChatInputBubble;
