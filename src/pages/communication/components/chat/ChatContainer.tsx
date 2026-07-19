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
  onSubmitListening: () => void;
}

const ChatContainer = ({
  bubbles,
  isListening,
  draftReply,
  draftListening,
  onDraftReplyChange,
  onDraftListeningChange,
  onSubmitReply,
  onSubmitListening,
}: ChatContainerPropTypes) => {
  // 한쪽에 입력이 있으면(길이 > 0), 반대쪽 버블이 아래에서 올라오는 애니메이션을 탄다.
  const isReplyTyping = draftReply.length > 0;
  const isListeningTyping = draftListening.length > 0;

  return (
    <div className="flex flex-col justify-end gap-xl px-xs py-base">
      {/* Enter로 전송된 내용들이 여기 쌓여서 입력창 위로 올라간다 */}
      {bubbles.map((bubble) => (
        <ChatBubble key={bubble.id} bubble={bubble} />
      ))}

      {/* 기본 텍스트 입력 한 쌍을 감싸는 전체 컨테이너: 왼쪽(상대방 텍스트 입력) + 오른쪽(내 답변 입력) */}
      <div className="flex flex-col items-start justify-center gap-[0.625rem] self-stretch p-base">
        <ListeningBubble
          isListening={isListening}
          value={draftListening}
          onChange={onDraftListeningChange}
          onSubmit={onSubmitListening}
          riseTrigger={isReplyTyping}
        />
        <ChatInputBubble
          value={draftReply}
          onChange={onDraftReplyChange}
          onSubmit={onSubmitReply}
          riseTrigger={isListeningTyping}
        />
      </div>
    </div>
  );
};

export default ChatContainer;
