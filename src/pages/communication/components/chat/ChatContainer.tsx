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

  // 주의: 두 버블은 JSX상 항상 같은 순서(왼쪽 먼저, 오른쪽 나중)로만 렌더링한다.
  // 예전엔 위/아래를 바꾸려고 조건부로 렌더링 순서 자체를 뒤집었는데, 그러면 같은 위치에
  // 렌더되는 컴포넌트 "타입"이 바뀌어서 리액트가 둘 다(지금 타이핑 중인 쪽까지) 통째로
  // 리마운트해버렸다 - 그래서 오른쪽에 입력 중인데도 그 버블이 리셋되며 왼쪽으로 밀린 것처럼
  // 보였던 것. 이제는 DOM 순서는 그대로 두고 CSS order로만 화면상 위/아래를 바꾼다.
  const listeningBubble = (
    // key를 바꿔서 순서가 뒤집히는 순간 새 DOM으로 다시 mount시킨다.
    // 그래야 "그 자리에서 스르륵" 이 아니라 "새 영역이 생겨서 그 안에 나타나는" 것처럼 보인다.
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
    // key를 바꿔서 순서가 뒤집히는 순간 새 DOM으로 다시 mount시킨다.
    // 그래야 "그 자리에서 스르륵" 이 아니라 "새 영역이 생겨서 그 안에 나타나는" 것처럼 보인다.
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
    // 버블 사이 간격(2rem)은 별도 gap 없이, 각 버블 컨테이너 자체의 p-base(위아래 1rem씩)가
    // 맞닿으면서 자연스럽게 2rem이 되도록 한다. 여기에 gap을 추가로 주면 1rem+gap+1rem으로
    // 간격이 배로 벌어지니 주의.
    <div className="flex flex-col justify-end px-xs py-base">
      {/* Enter로 전송된 내용들이 여기 쌓여서 입력창 위로 올라간다.
          버블마다 방향(direction)에 맞는 컨테이너로 개별적으로 감싸서, 왼쪽/오른쪽이
          실제로 화면 좌우에 붙도록 한다. */}
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

      {/* 기본 텍스트 입력 한 쌍을 감싸는 전체 컨테이너: 입력 중인 쪽이 위, 반대쪽이 그 아래에 생긴다.
          둘 다 비어있는 idle 상태는 마지막으로 입력했던 쪽의 순서를 그대로 유지한다. */}
      <div className={BUBBLE_CONTAINER_CLASSNAME}>
        {listeningBubble}
        {inputBubble}
      </div>
    </div>
  );
};

export default ChatContainer;
