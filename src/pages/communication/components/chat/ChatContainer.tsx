import { useState } from 'react';

import ChatInputBubble from '@/pages/communication/components/chat/ChatInputBubble';
import ListeningBubble from '@/pages/communication/components/chat/ListeningBubble';

interface ChatContainerPropTypes {
  isListening: boolean;
  draftReply: string;
  draftListening: string;
  onDraftReplyChange: (value: string) => void;
  onDraftListeningChange: (value: string) => void;
  onSubmitReply: () => void;
  onSubmitListening: () => void;
}

// 기본 입력 한 쌍(왼쪽/오른쪽) 컨테이너에 공통으로 쓰는 스타일.
// 세로 간격은 gap 한 곳에서만 만들고 상하 패딩은 두지 않는다.
// 패딩을 두면 위(대화기록)/아래(녹음 버튼)와의 간격이 여기서 한 번 더 더해져 어긋난다.
const BUBBLE_CONTAINER_CLASSNAME =
  'flex flex-col items-start justify-center gap-xs self-stretch px-base';

// 기본 텍스트 입력 버블 쌍(대화기록과 별도, 스크롤 영역 밖에 고정 배치).
// 위로 스크롤해서 지난 대화기록을 보더라도 이 영역은 항상 화면 하단에 그대로 보인다.
const ChatContainer = ({
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
  // 그 순서를 그대로 유지한다. 처음(둘 다 입력한 적 없음)엔 오른쪽이 위인 기본값을 쓴다.
  const [lastActiveSide, setLastActiveSide] = useState<'left' | 'right'>(
    'right',
  );

  // lastActiveSide를 effect 안에서 갱신하면 렌더 결과로부터 파생되는 상태를 effect로
  // 되돌려 쓰는 형태(set-state-in-effect)가 된다. 입력이 실제로 들어오는 onChange 시점에
  // 같이 갱신하면 effect 없이 동일하게 동작한다.
  const handleDraftReplyChange = (value: string) => {
    if (value.length > 0) {
      setLastActiveSide('right');
    }
    onDraftReplyChange(value);
  };

  const handleDraftListeningChange = (value: string) => {
    if (value.length > 0) {
      setLastActiveSide('left');
    }
    onDraftListeningChange(value);
  };

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
      onChange={handleDraftListeningChange}
      onSubmit={onSubmitListening}
      isSpawning={isReplyTyping}
      order={isRightOnTop ? 2 : 1}
    />
  );

  const inputBubble = (
    <ChatInputBubble
      key={isListeningTyping ? 'input-below' : 'input-default'}
      value={draftReply}
      onChange={handleDraftReplyChange}
      onSubmit={onSubmitReply}
      isSpawning={isListeningTyping}
      order={isRightOnTop ? 1 : 2}
    />
  );

  return (
    <div className="shrink-0 px-xs">
      <div className={BUBBLE_CONTAINER_CLASSNAME}>
        {listeningBubble}
        {inputBubble}
      </div>
    </div>
  );
};

export default ChatContainer;
