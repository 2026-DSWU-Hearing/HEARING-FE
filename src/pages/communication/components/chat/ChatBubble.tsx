import type { ChatBubbleTypes } from '@/pages/communication/types/communication-Types';

interface ChatBubblePropTypes {
  bubble: ChatBubbleTypes;
}

const ChatBubble = ({ bubble }: ChatBubblePropTypes) => {
  const isRight = bubble.direction === 'right';

  return (
    <div className={`flex ${isRight ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`heading-2xl-semibold flex min-h-[1.75rem] min-w-[5.75rem] max-w-[75%] items-center justify-center gap-[0.625rem] whitespace-pre-line rounded-2xl px-lg py-base ${
          isRight
            ? 'rounded-br-sm bg-primary-400 text-neutral-700'
            : 'rounded-bl-sm card-listening-bubble text-secondary'
        }`}
      >
        {bubble.content}
      </div>
    </div>
  );
};

export default ChatBubble;
