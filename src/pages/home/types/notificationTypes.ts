import type { InfiniteData } from '@tanstack/react-query';

import type { DetectionTypes } from '@/shared/types/detectionTypes';

export interface NotificationListResponseTypes {
  items: DetectionTypes[];
  next_cursor: string | null;
  has_next: boolean;
}

export interface NotificationDeleteRequestTypes {
  ids: number[];
}

export interface NotificationDeleteResponseTypes {
  deleted_count: number;
}

export interface NotificationDeleteResultTypes {
  deletedCount: number;
  requestedIds: number[];
}

export interface NotificationPageStateTypes {
  isDeleteMode: boolean;
  selectedIds: Set<number>;
  deletionErrorMessage: string | null;
}

export type NotificationPageActionTypes =
  | { type: 'OPEN_DELETE_MODE' }
  | { type: 'CLOSE_DELETE_MODE' }
  | { type: 'TOGGLE_NOTIFICATION'; id: number }
  | { type: 'SET_SELECTED_NOTIFICATIONS'; ids: number[] }
  | { type: 'START_DELETE' }
  | { type: 'COMPLETE_DELETE' }
  | { type: 'FAIL_DELETE'; message: string };

export type NotificationInfiniteDataTypes = InfiniteData<
  NotificationListResponseTypes,
  unknown
>;
