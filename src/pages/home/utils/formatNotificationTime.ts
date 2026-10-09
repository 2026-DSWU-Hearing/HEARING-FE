const padDatePart = (value: number) => `${value}`.padStart(2, '0');

export const formatNotificationAbsoluteTime = (detectedAt: string) => {
  const detectedDate = new Date(detectedAt);
  if (Number.isNaN(detectedDate.getTime())) return '시간 정보 없음';

  const year = padDatePart(detectedDate.getFullYear() % 100);
  const month = padDatePart(detectedDate.getMonth() + 1);
  const date = padDatePart(detectedDate.getDate());
  const hours = padDatePart(detectedDate.getHours());
  const minutes = padDatePart(detectedDate.getMinutes());

  return `${year}.${month}.${date} ${hours}:${minutes}`;
};

export const formatNotificationRelativeTime = (
  detectedAt: string,
  currentTime: number,
) => {
  const detectedTime = new Date(detectedAt).getTime();
  if (Number.isNaN(detectedTime)) return '시간 정보 없음';

  const elapsedSeconds = Math.max(
    0,
    Math.floor((currentTime - detectedTime) / 1000),
  );
  if (elapsedSeconds < 60) return '방금 전';

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  if (elapsedMinutes < 60) return `${elapsedMinutes}분 전`;

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours}시간 전`;

  return `${Math.floor(elapsedHours / 24)}일 전`;
};
