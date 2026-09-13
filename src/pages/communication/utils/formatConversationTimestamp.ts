const padTwoDigits = (value: number) => String(value).padStart(2, '0');

// 대화의 startedAt / endedAt에 쓰는 형식. 목데이터와 같은 'YYYY-MM-DD HH:mm'이라
// formatConversationDate가 그대로 파싱할 수 있다.
export const formatConversationTimestamp = (date: Date = new Date()) => {
  const year = date.getFullYear();
  const month = padTwoDigits(date.getMonth() + 1);
  const day = padTwoDigits(date.getDate());
  const hours = padTwoDigits(date.getHours());
  const minutes = padTwoDigits(date.getMinutes());

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};
