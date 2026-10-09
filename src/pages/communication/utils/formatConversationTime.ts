export const formatConversationTime = (dateTime: string) =>
  new Date(dateTime).toLocaleTimeString('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
  });
