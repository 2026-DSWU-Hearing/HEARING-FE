import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ConversationHistoryList from '@/pages/communication/components/history/ConversationHistoryList';
import { CONVERSATION_HISTORY_MESSAGE } from '@/pages/communication/constants/conversationHistoryMessages';
import { useDeleteConversation } from '@/pages/communication/hooks/useDeleteConversation';
import { useGetConversations } from '@/pages/communication/hooks/useGetConversations';
import TopNavigation from '@/layout/TopNavigation';
import AlertModal from '@/shared/components/AlertModal';
import ConfirmModal from '@/shared/components/ConfirmModal';

const MESSAGE_CLASSNAME = 'body-sm-regular mt-lg text-center text-neutral-500';

const ConversationHistoryPage = () => {
  const navigate = useNavigate();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchNextPageError,
    isFetchingNextPage,
    isPending,
    refetch,
  } = useGetConversations();
  const { mutate: deleteConversation, isPending: isDeleting } =
    useDeleteConversation();

  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isDeleteFailed, setIsDeleteFailed] = useState(false);

  const histories =
    data?.pages
      .flatMap(({ conversations }) => conversations)
      .filter(({ ended_at: endedAt }) => endedAt !== null) ?? [];

  useEffect(() => {
    const loadMoreElement = loadMoreRef.current;
    if (!loadMoreElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          !isFetchNextPageError
        ) {
          void fetchNextPage();
        }
      },
      { rootMargin: '200px 0px' },
    );

    observer.observe(loadMoreElement);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isFetchNextPageError]);

  const handleToggleDeleteMode = () => {
    setIsDeleteMode((prev) => !prev);
  };

  const handleSelectHistory = (id: number) => {
    navigate(`/communication/histories/${id}`);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId === null || isDeleting) return;

    deleteConversation(deleteTargetId, {
      onSuccess: () => setIsDeleteMode(false),
      onError: () => setIsDeleteFailed(true),
    });
  };

  const handleRetryClick = () => {
    void refetch();
  };

  const handleLoadMoreRetryClick = () => {
    void fetchNextPage();
  };

  const renderContent = () => {
    if (isPending) {
      return (
        <p role="status" className={MESSAGE_CLASSNAME}>
          {CONVERSATION_HISTORY_MESSAGE.LOADING}
        </p>
      );
    }

    if (isError && !isFetchNextPageError) {
      return (
        <div role="alert" className="mt-lg flex flex-col items-center gap-sm">
          <p className="body-sm-regular text-neutral-500">
            {CONVERSATION_HISTORY_MESSAGE.LOAD_FAILED}
          </p>
          <button
            type="button"
            onClick={handleRetryClick}
            className="body-sm-medium rounded-lg border border-neutral-600 px-base py-xs text-primary"
          >
            {CONVERSATION_HISTORY_MESSAGE.RETRY}
          </button>
        </div>
      );
    }

    return (
      <ConversationHistoryList
        histories={histories}
        isDeleteMode={isDeleteMode}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isFetchNextPageError={isFetchNextPageError}
        loadMoreRef={loadMoreRef}
        onSelect={handleSelectHistory}
        onDelete={handleDeleteClick}
        onLoadMoreRetry={handleLoadMoreRetryClick}
      />
    );
  };

  return (
    <div className="flex min-h-dvh flex-col bg-neutral-950 pb-[9.5rem]">
      <TopNavigation
        title={CONVERSATION_HISTORY_MESSAGE.TITLE}
        rightText={
          isDeleteMode
            ? CONVERSATION_HISTORY_MESSAGE.DONE
            : CONVERSATION_HISTORY_MESSAGE.DELETE
        }
        rightVariant={isDeleteMode ? 'active' : 'default'}
        onRightClick={handleToggleDeleteMode}
      />

      {renderContent()}

      <ConfirmModal
        isOpen={deleteTargetId !== null}
        message={CONVERSATION_HISTORY_MESSAGE.DELETE_CONFIRM}
        onConfirm={handleConfirmDelete}
        onCancel={() => {}}
        onClose={() => setDeleteTargetId(null)}
      />

      <AlertModal
        isOpen={isDeleteFailed}
        message={CONVERSATION_HISTORY_MESSAGE.DELETE_FAILED}
        onClose={() => setIsDeleteFailed(false)}
      />
    </div>
  );
};

export default ConversationHistoryPage;
