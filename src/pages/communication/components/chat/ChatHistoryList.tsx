import ChatBubble from '@/pages/communication/components/chat/ChatBubble';
import type { ChatBubbleTypes } from '@/pages/communication/types/communication-Types';

interface ChatHistoryListPropTypes {
  bubbles: ChatBubbleTypes[];
}

// 제출되어 위로 올라간(historical) 채팅 버블 하나하나를 감싸는 컨테이너.
// 컨테이너의 align-items로 좌/우를 결정하기 때문에, 버블 방향마다 컨테이너 자체를 다르게 써야
// 실제로 화면 좌/우에 붙는다(버블 자신은 stretch되지 않아 부모의 justify-end만으론 안 먹힘).
//
// 세로 간격은 이 래퍼가 아니라 부모의 gap 한 곳에서만 만든다.
// 래퍼마다 상하 패딩을 주면 인접한 두 버블 사이에 패딩이 두 번 쌓여 간격이 두 배가 된다.
const LEFT_HISTORY_BUBBLE_CONTAINER_CLASSNAME =
  'flex flex-col items-start self-stretch px-base';
const RIGHT_HISTORY_BUBBLE_CONTAINER_CLASSNAME =
  'flex flex-col items-end self-stretch px-base';

// 스크롤되는 대화기록 영역. 기본 입력 버블 쌍(ChatContainer)은 이 목록 바깥, 스크롤 영역
// 밖에 별도로 고정 배치되어 있어서 위로 스크롤해도 항상 화면 하단에 그대로 보인다.
//
// 간격 규칙: 화면 아래쪽 세로 간격은 전부 --spacing-xs(0.5rem)로 통일한다.
// 버블-버블, 버블-입력창, 입력창-녹음버튼이 모두 같은 값이어야 한 덩어리로 읽힌다.
const ChatHistoryList = ({ bubbles }: ChatHistoryListPropTypes) => {
  return (
    <div className="mt-auto flex flex-col gap-xs px-xs pt-xs">
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
    </div>
  );
};

export default ChatHistoryList;
