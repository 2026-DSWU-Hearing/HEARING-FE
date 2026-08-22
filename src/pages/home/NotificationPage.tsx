import NotificationHeader from '@/pages/home/components/notification/NotificationHeader';
import NotificationList from '@/pages/home/components/notification/NotificationList';
import { useNotificationPage } from '@/pages/home/hooks/useNotificationPage';

const NotificationPage = () => {
  const {
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
    isInitialLoading,
    isInitialError,
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
  } = useNotificationPage();

  return (
    <div className="flex min-h-dvh flex-col pb-[9.5rem]">
      <NotificationHeader
        isDeleteMode={isDeleteMode}
        hasNotifications={hasNotifications}
        hasSelection={hasSelection}
        isAllSelected={isAllSelected}
        isDisabled={isDeleting}
        onTrashClick={handleTrashClick}
        onSelectAll={handleSelectAllClick}
        onCloseDeleteMode={handleCloseDeleteModeClick}
      />

      <NotificationList
        notifications={notifications}
        currentTime={currentTime}
        isDeleteMode={isDeleteMode}
        selectedIds={selectedIds}
        isDeleting={isDeleting}
        deletionErrorMessage={deletionErrorMessage}
        isInitialLoading={isInitialLoading}
        isInitialError={isInitialError}
        isFetchingNextPage={isFetchingNextPage}
        isFetchNextPageError={isFetchNextPageError}
        hasNextPage={hasNextPage}
        loadMoreRef={loadMoreRef}
        onSelect={handleNotificationSelectClick}
        onDeleteRetry={handleDeleteNotifications}
        onInitialRetry={handleNotificationsRetryClick}
        onAdditionalRetry={handleAdditionalNotificationsRetryClick}
      />
    </div>
  );
};

export default NotificationPage;
