import { useEffect, useState } from 'react';

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

// 기본 입력 한 쌍(왼쪽/오른쪽) 컨테이너에 공통으로 쓰는 스타일.
const BUBBLE_CONTAINER_CLASSNAME =
  'flex flex-col items-start justify-center gap-[0.625rem] self-stretch p-base';

// 제출되어 위로 올라간(historical) 채팅 버블 하나하나를 감싸는 컨테이너.
// 컨테이너의 align-items로 좌/우를 결정하기 때문에, 버블 방향마다 컨테이너 자체를 다르게 써야
// 실제로 화면 좌/우에 붙는다(버블 자신은 stretch되지 않아 부모의 justify-end만으론 안 먹힘).
const LEFT_HISTORY_BUBBLE_CONTAINER_CLASSNAME =
  'flex flex-col items-start justify-center gap-[0.625rem] self-stretch p-base';
const RIGHT_HISTORY_BUBBLE_CONTAINER_CLASSNAME =
  'flex flex-col items-end gap-[0.625rem] self-stretch p-base';

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
  const isReplyTyping = draftReply.length > 0;
  const isListeningTyping = draftListening.length > 0;

  // 마지막으로 입력해서 위로 올라간 쪽을 기억해뒀다가, 양쪽 다 비어있는(idle) 동안에도
  // 그 순서를 그대로 유지한다. 처음(둘 다 입력한 적 없음)엔 왼쪽이 위인 기본값을 쓴다.
  const [lastActiveSide, setLastActiveSide] = useState<'left' | 'right'>(
    'right',
  );

  useEffect(() => {
    if (isReplyTyping) {
      setLastActiveSide('right');
    } else if (isListeningTyping) {
      setLastActiveSide('left');
    }
  }, [isReplyTyping, isListeningTyping]);

  // 지금 실제로 입력 중인 쪽이 있으면 그쪽을 우선하고, 둘 다 비어있으면 마지막으로
  // 입력했던 쪽(lastActiveSide)을 그대로 따른다.
  const activeSide = isReplyTyping
    ? 'right'
    : isListeningTyping
      ? 'left'
      : lastActiveSide;

  const isRightOnTop = activeSide === 'right';

  const listeningBubble = (
    <ListeningBubble
      key={isReplyTyping ? 'listening-below' : 'listening-default'}
      isListening={isListening}
      value={draftListening}
      onChange={onDraftListeningChange}
      onSubmit={onSubmitListening}
      isSpawning={isReplyTyping}
      order={isRightOnTop ? 2 : 1}
    />
  );

  const inputBubble = (
    <ChatInputBubble
      key={isListeningTyping ? 'input-below' : 'input-default'}
      value={draftReply}
      onChange={onDraftReplyChange}
      onSubmit={onSubmitReply}
      isSpawning={isListeningTyping}
      order={isRightOnTop ? 1 : 2}
    />
  );

  return (
    <div className="flex flex-col justify-end px-xs py-base">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className={
            bubble.direction === 'right'
              ? RIGHT_HISTORY_BUBBLE_CONTAINER_CLASSNAME
              : LEFT_HISTORY_BUBBLE_CONTAINER_CLASSNAME
          }
        >
          <ChatBubble bubble={bubble} />
        </div>
      ))}

      <div className={BUBBLE_CONTAINER_CLASSNAME}>
        {listeningBubble}
        {inputBubble}
      </div>
    </div>
  );
};

export default ChatContainer;
