import { useEffect, useMemo, useReducer, useRef, useState } from 'react';

import { useDeleteNotifications } from '@/pages/home/hooks/useDeleteNotifications';
import { useGetNotifications } from '@/pages/home/hooks/useGetNotifications';
import { NOTIFICATION_TIME_REFRESH_INTERVAL } from '@/pages/home/constants/notificationConstants';
import { getUniqueSortedNotifications } from '@/pages/home/utils/notificationCache';

import type {
  NotificationPageActionTypes,
  NotificationPageStateTypes,
} from '@/pages/home/types/notificationTypes';

const INITIAL_NOTIFICATION_PAGE_STATE: NotificationPageStateTypes = {
  isDeleteMode: false,
  selectedIds: new Set(),
  deletionErrorMessage: null,
};

const notificationPageReducer = (
  state: NotificationPageStateTypes,
  action: NotificationPageActionTypes,
): NotificationPageStateTypes => {
  switch (action.type) {
    case 'OPEN_DELETE_MODE':
      return { ...state, isDeleteMode: true, deletionErrorMessage: null };
    case 'CLOSE_DELETE_MODE':
    case 'COMPLETE_DELETE':
      return INITIAL_NOTIFICATION_PAGE_STATE;
    case 'TOGGLE_NOTIFICATION': {
      const selectedIds = new Set(state.selectedIds);
      if (selectedIds.has(action.id)) {
        selectedIds.delete(action.id);
      } else {
        selectedIds.add(action.id);
      }

      return { ...state, selectedIds, deletionErrorMessage: null };
    }
    case 'SET_SELECTED_NOTIFICATIONS':
      return {
        ...state,
        selectedIds: new Set(action.ids),
        deletionErrorMessage: null,
      };
    case 'START_DELETE':
      return { ...state, deletionErrorMessage: null };
    case 'FAIL_DELETE':
      return { ...state, deletionErrorMessage: action.message };
    default:
      return state;
  }
};

export const useNotificationPage = () => {
  const [state, dispatch] = useReducer(
    notificationPageReducer,
    INITIAL_NOTIFICATION_PAGE_STATE,
  );
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const notificationsQuery = useGetNotifications();
  const deleteNotificationsMutation = useDeleteNotifications();
  const {
    data: notificationData,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchNextPageError,
    isFetchingNextPage,
    isPending,
    refetch,
  } = notificationsQuery;

  const notifications = useMemo(
    () => getUniqueSortedNotifications(notificationData),
    [notificationData],
  );
  const notificationIds = useMemo(
    () => notifications.map(({ id }) => id),
    [notifications],
  );

  const { isDeleteMode, selectedIds, deletionErrorMessage } = state;
  const hasNotifications = notifications.length > 0;
  const hasSelection = selectedIds.size > 0;
  const isAllSelected =
    hasNotifications && notificationIds.every((id) => selectedIds.has(id));
  const isDeleting = deleteNotificationsMutation.isPending;

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, NOTIFICATION_TIME_REFRESH_INTERVAL);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const loadMoreElement = loadMoreRef.current;
    if (!loadMoreElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          !isFetchNextPageError &&
          !isDeleting
        ) {
          void fetchNextPage();
        }
      },
      { rootMargin: '200px 0px' },
    );

    observer.observe(loadMoreElement);
    return () => observer.disconnect();
  }, [
    fetchNextPage,
    hasNextPage,
    isDeleting,
    isFetchNextPageError,
    isFetchingNextPage,
  ]);

  const handleCloseDeleteModeClick = () => {
    if (isDeleting) return;
    dispatch({ type: 'CLOSE_DELETE_MODE' });
  };

  const handleSelectAllClick = () => {
    if (isDeleting) return;
    dispatch({
      type: 'SET_SELECTED_NOTIFICATIONS',
      ids: isAllSelected ? [] : notificationIds,
    });
  };

  const handleNotificationSelectClick = (id: number) => {
    if (isDeleting) return;
    dispatch({ type: 'TOGGLE_NOTIFICATION', id });
  };

  const handleDeleteNotifications = async () => {
    if (!hasSelection || isDeleting) return;

    dispatch({ type: 'START_DELETE' });
    try {
      await deleteNotificationsMutation.mutateAsync(Array.from(selectedIds));
      dispatch({ type: 'COMPLETE_DELETE' });
    } catch {
      dispatch({
        type: 'FAIL_DELETE',
        message: '알림을 삭제하지 못했어요. 선택한 항목을 다시 시도해 주세요.',
      });
    }
  };

  const handleTrashClick = () => {
    if (isDeleting) return;
    if (!isDeleteMode) {
      dispatch({ type: 'OPEN_DELETE_MODE' });
      return;
    }
    if (!hasSelection) {
      dispatch({ type: 'CLOSE_DELETE_MODE' });
      return;
    }

    void handleDeleteNotifications();
  };

  const handleNotificationsRetryClick = () => {
    void refetch();
  };

  const handleAdditionalNotificationsRetryClick = () => {
    if (isDeleting) return;
    void fetchNextPage();
  };

  return {
    notifications,
    currentTime,
    loadMoreRef,
    isDeleteMode,
    selectedIds,
    deletionErrorMessage,
    hasNotifications,
    hasSelection,
    isAllSelected,
    isDeleting,
    isInitialLoading: isPending,
    isInitialError: isError && !notificationData,
    isFetchingNextPage,
    isFetchNextPageError,
    hasNextPage,
    handleTrashClick,
    handleSelectAllClick,
    handleCloseDeleteModeClick,
    handleNotificationSelectClick,
    handleDeleteNotifications,
    handleNotificationsRetryClick,
    handleAdditionalNotificationsRetryClick,
  };
};
