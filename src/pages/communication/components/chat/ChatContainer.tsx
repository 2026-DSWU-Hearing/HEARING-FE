import ChatBubble from '@/pages/communication/components/chat/ChatBubble';
import ChatInputBubble from '@/pages/communication/components/chat/ChatInputBubble';
import ListeningBubble from '@/pages/communication/components/chat/ListeningBubble';
import type { ChatBubbleTypes } from '@/pages/communication/types/communication-Types';

interface ChatContainerPropTypes {
  bubbles: ChatBubbleTypes[];
  isListening: boolean;
  draftReply: string;
  draftListening: string;
  onDraftReplyChange: (value: string) => void;
  onDraftListeningChange: (value: string) => void;
  onSubmitReply: () => void;
}

const ChatContainer = ({
  bubbles,
  isListening,
  draftReply,
  draftListening,
  onDraftReplyChange,
  onDraftListeningChange,
  onSubmitReply,
}: ChatContainerPropTypes) => {
  return (
    <div className="flex flex-col justify-end gap-xl px-xs py-base">
      {/* Enter로 전송된 답변들이 여기 쌓여서 입력창 위로 올라간다 */}
      {bubbles.map((bubble) => (
        <ChatBubble key={bubble.id} bubble={bubble} />
      ))}

      {/* 기본 텍스트 입력 한 쌍: 왼쪽(상대방 텍스트 입력) + 오른쪽(내 답변 입력) */}
      <ListeningBubble
        isListening={isListening}
        value={draftListening}
        onChange={onDraftListeningChange}
      />
      <ChatInputBubble
        value={draftReply}
        onChange={onDraftReplyChange}
        onSubmit={onSubmitReply}
      />
    </div>
  );
};

export default ChatContainer;
