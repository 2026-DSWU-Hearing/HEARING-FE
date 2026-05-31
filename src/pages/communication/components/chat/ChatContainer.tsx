import ChatBubble from '@/pages/communication/components/chat/ChatBubble';
import ListeningBubble from '@/pages/communication/components/chat/ListeningBubble';
import type { ChatBubbleTypes } from '@/pages/communication/types/communication-Types';

interface ChatContainerPropTypes {
  bubbles: ChatBubbleTypes[];
  isListening: boolean;
}

const ChatContainer = ({ bubbles, isListening }: ChatContainerPropTypes) => {
  return (
    <section className="flex flex-col justify-end gap-3 px-4 py-4">
      {bubbles.map((bubble) => (
        <ChatBubble key={bubble.id} bubble={bubble} />
      ))}

      {isListening && <ListeningBubble />}
    </section>
  );
};

export default ChatContainer;
