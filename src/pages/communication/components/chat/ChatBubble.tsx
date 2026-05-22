import type { ChatBubbleTypes } from '@/pages/communication/types/communication-Types';

interface ChatBubblePropTypes {
  bubble: ChatBubbleTypes;
}

const ChatBubble = ({ bubble }: ChatBubblePropTypes) => {
  const isRight = bubble.direction === 'right';

  return (
    <div className={`flex ${isRight ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
          isRight ? 'bg-orange-400 text-white' : 'bg-gray-100 text-gray-900'
        }`}
      >
        {bubble.content}
      </div>
    </div>
  );
};

export default ChatBubble;
