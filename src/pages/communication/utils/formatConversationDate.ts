export const formatConversationDate = (dateTime: string) => {
  const date = new Date(dateTime);

  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};
