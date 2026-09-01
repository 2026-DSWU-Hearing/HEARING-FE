export const formatConversationDate = (startedAt: string) => {
  const [date] = startedAt.split(' ');
  const [, month, day] = date.split('-');

  return `${Number(month)}월 ${Number(day)}일`;
};
