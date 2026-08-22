import type { DetectionTypes } from '@/shared/types/detectionTypes';
import type { NotificationInfiniteDataTypes } from '@/pages/home/types/notificationTypes';

const getDetectedTime = (detection: DetectionTypes) => {
  const detectedTime = new Date(detection.detected_at).getTime();
  return Number.isNaN(detectedTime) ? 0 : detectedTime;
};

const isDetection = (value: unknown): value is DetectionTypes => {
  if (!value || typeof value !== 'object') return false;

  const detection = value as Record<string, unknown>;
  const { location } = detection;

  return (
    typeof detection.id === 'number' &&
    Number.isInteger(detection.id) &&
    typeof detection.sound_name === 'string' &&
    typeof detection.sound_category === 'string' &&
    typeof detection.source === 'string' &&
    typeof detection.confidence === 'number' &&
    Number.isFinite(detection.confidence) &&
    (location === null || typeof location === 'string') &&
    typeof detection.detected_at === 'string'
  );
};

const isNotificationPage = (value: unknown) => {
  if (!value || typeof value !== 'object') return false;

  const page = value as Record<string, unknown>;
  const { next_cursor: nextCursor } = page;

  return (
    Array.isArray(page.items) &&
    page.items.every(isDetection) &&
    (nextCursor === null || typeof nextCursor === 'string') &&
    typeof page.has_next === 'boolean'
  );
};

export const isNotificationInfiniteData = (
  data: unknown,
): data is NotificationInfiniteDataTypes => {
  if (!data || typeof data !== 'object') return false;

  const infiniteData = data as Record<string, unknown>;
  if (!Array.isArray(infiniteData.pages)) return false;
  if (!Array.isArray(infiniteData.pageParams)) return false;

  return (
    infiniteData.pages.every(isNotificationPage) &&
    infiniteData.pageParams.every(
      (pageParam) => pageParam === null || typeof pageParam === 'string',
    )
  );
};

export const getUniqueSortedNotifications = (
  data: NotificationInfiniteDataTypes | undefined,
) => {
  const notificationById = new Map<number, DetectionTypes>();

  if (!isNotificationInfiniteData(data)) return [];

  data.pages.forEach(({ items }) => {
    items.forEach((notification) => {
      notificationById.set(notification.id, notification);
    });
  });

  return Array.from(notificationById.values()).sort((first, second) => {
    const detectedTimeDifference =
      getDetectedTime(second) - getDetectedTime(first);

    return detectedTimeDifference || second.id - first.id;
  });
};

export const filterNotificationsFromCache = (
  data: NotificationInfiniteDataTypes | undefined,
  deletedIds: Set<number>,
) => {
  if (!isNotificationInfiniteData(data)) return data;

  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items.filter(({ id }) => !deletedIds.has(id)),
    })),
  };
};

export const mergeNotificationIntoCache = (
  data: NotificationInfiniteDataTypes,
  notification: DetectionTypes,
): NotificationInfiniteDataTypes => {
  if (!isNotificationInfiniteData(data) || data.pages.length === 0) return data;

  return {
    ...data,
    pages: data.pages.map((page, pageIndex) => ({
      ...page,
      items:
        pageIndex === 0
          ? [
              notification,
              ...page.items.filter(({ id }) => id !== notification.id),
            ]
          : page.items.filter(({ id }) => id !== notification.id),
    })),
  };
};
