import type { RefObject } from 'react';

import NotificationBar from '@/pages/home/components/notification/NotificationBar';

import type { DetectionTypes } from '@/shared/types/detectionTypes';

interface NotificationListPropTypes {
  notifications: DetectionTypes[];
  currentTime: number;
  isDeleteMode: boolean;
  selectedIds: Set<number>;
  isDeleting: boolean;
  deletionErrorMessage: string | null;
  isInitialLoading: boolean;
  isInitialError: boolean;
  isFetchingNextPage: boolean;
  isFetchNextPageError: boolean;
  hasNextPage: boolean;
  loadMoreRef: RefObject<HTMLDivElement | null>;
  onSelect: (id: number) => void;
  onDeleteRetry: () => void;
  onInitialRetry: () => void;
  onAdditionalRetry: () => void;
}

const NotificationList = ({
  notifications,
  currentTime,
  isDeleteMode,
  selectedIds,
  isDeleting,
  deletionErrorMessage,
  isInitialLoading,
  isInitialError,
  isFetchingNextPage,
  isFetchNextPageError,
  hasNextPage,
  loadMoreRef,
  onSelect,
  onDeleteRetry,
  onInitialRetry,
  onAdditionalRetry,
}: NotificationListPropTypes) => {
  if (isInitialLoading) {
    return (
      <p
        role="status"
        className="body-sm-regular pt-[1rem] text-center text-secondary"
      >
        알림을 불러오는 중이에요.
      </p>
    );
  }

  if (isInitialError) {
    return (
      <div
        role="alert"
        className="flex flex-col items-center gap-sm px-[1.34rem] pt-[1rem] text-center"
      >
        <p className="body-sm-regular text-secondary">
          알림을 불러오지 못했어요.
        </p>
        <button
          type="button"
          onClick={onInitialRetry}
          className="body-sm-medium rounded-lg border border-neutral-600 px-base py-xs text-primary"
        >
          다시 시도
        </button>
      </div>
    );
  }

  const deletionError = deletionErrorMessage ? (
    <div
      role="alert"
      className="mx-[1.34rem] mb-base flex items-center justify-between gap-sm rounded-lg border border-state-alert px-sm py-xs"
    >
      <p className="body-sm-regular text-state-alert">{deletionErrorMessage}</p>
      <button
        type="button"
        onClick={onDeleteRetry}
        disabled={isDeleting}
        className="body-sm-medium shrink-0 text-primary disabled:cursor-wait disabled:text-disabled"
      >
        삭제 다시 시도
      </button>
    </div>
  ) : null;

  if (
    notifications.length === 0 &&
    !hasNextPage &&
    !isFetchingNextPage &&
    !isFetchNextPageError
  ) {
    return (
      <div>
        {deletionError}
        <p className="body-sm-regular pt-[1rem] text-center text-secondary">
          받은 알림이 없어요.
        </p>
      </div>
    );
  }

  return (
    <div>
      {deletionError}

      <ul
        aria-busy={isDeleting}
        className={`flex flex-col gap-base px-[1.34rem] transition-[padding] duration-200 ease-out ${
          isDeleteMode ? 'pt-[0.81rem]' : ''
        }`}
      >
        {notifications.map((notification) => (
          <li key={notification.id}>
            <NotificationBar
              notification={notification}
              currentTime={currentTime}
              isDeleteMode={isDeleteMode}
              isSelected={selectedIds.has(notification.id)}
              isDisabled={isDeleting}
              onSelect={onSelect}
            />
          </li>
        ))}
      </ul>

      {(hasNextPage || isFetchingNextPage) && (
        <div ref={loadMoreRef} className="min-h-12" aria-hidden="true" />
      )}

      {isFetchingNextPage && (
        <p
          role="status"
          className="body-sm-regular py-base text-center text-secondary"
        >
          알림을 더 불러오는 중이에요.
        </p>
      )}

      {isFetchNextPageError && (
        <div
          role="alert"
          className="flex flex-col items-center gap-xs py-base text-center"
        >
          <p className="body-sm-regular text-secondary">
            추가 알림을 불러오지 못했어요.
          </p>
          <button
            type="button"
            onClick={onAdditionalRetry}
            disabled={isDeleting}
            className="body-sm-medium text-primary disabled:cursor-wait disabled:text-disabled"
          >
            다시 시도
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
