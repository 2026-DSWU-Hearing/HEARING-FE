import { useAutoGrowTextarea } from '@/shared/hooks/useAutoGrowTextarea';

interface ListeningBubblePropTypes {
  isListening: boolean;
  value: string;
  onChange: (value: string) => void;
}

// 대화의 다음 차례를 기다리는 왼쪽(상대방) 버블.
// 실제 STT 연동 전까지는 이 자리에 직접 텍스트를 입력해볼 수 있는 textarea로 동작한다.
// 버블의 패딩/모양은 바깥 wrapper가 담당하고, 안쪽 textarea는 패딩 없이 텍스트 폭만큼만
// 채워서 좌우/상하 여백이 항상 대칭이 되게 한다.
// 너비는 고정값이 아니라 입력된 텍스트 길이에 맞춰 늘어난다(useAutoGrowTextarea).
// 실제 STT 인식 결과가 도착하면(백엔드 연동 후) 이 자리 대신 확정된 ChatBubble로 쌓인다.
const ListeningBubble = ({
  isListening,
  value,
  onChange,
}: ListeningBubblePropTypes) => {
  const placeholder = isListening ? '듣는 중..' : '텍스트 입력';
  const { textareaRef, measureRef } = useAutoGrowTextarea(value, placeholder);

  return (
    <div className="relative flex justify-start">
      <div className="flex min-h-[1.75rem] min-w-[5.75rem] max-w-[75%] items-center justify-end gap-[0.625rem] rounded-2xl rounded-bl-sm px-lg py-base [background:linear-gradient(0deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.20)_100%),var(--color-neutral-700)]">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-label="상대방 텍스트 입력"
          rows={1}
          className="heading-2xl-semibold resize-none overflow-hidden border-none bg-transparent p-0 text-primary placeholder:text-primary outline-none"
        />
      </div>
      {/* 텍스트 실제 폭을 재기 위한 숨김 요소. 화면엔 보이지 않고 textarea와 같은 폰트 스타일만 공유한다. */}
      <span
        ref={measureRef}
        aria-hidden="true"
        className="heading-2xl-semibold invisible absolute left-0 top-0 -z-10 whitespace-pre"
      />
    </div>
  );
};

export default ListeningBubble;
