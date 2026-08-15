import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ConversationHistoryList from '@/pages/communication/components/history/ConversationHistoryList';
import { CONVERSATION_HISTORY_MESSAGE } from '@/pages/communication/constants/conversationHistoryMessages';
import { useGetCommunicationMock } from '@/pages/communication/hooks/useGetCommunicationMock';
import { useConversationHistoryStore } from '@/pages/communication/stores/useConversationHistoryStore';
import TopNavigation from '@/layout/TopNavigation';
import ConfirmModal from '@/shared/components/ConfirmModal';

const ConversationHistoryPage = () => {
  const navigate = useNavigate();
  const { data } = useGetCommunicationMock();

  const histories = useConversationHistoryStore((state) => state.histories);
  const initializeHistories = useConversationHistoryStore(
    (state) => state.initialize,
  );
  const deleteHistory = useConversationHistoryStore(
    (state) => state.deleteHistory,
  );

  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  useEffect(() => {
    if (!data) return;

    initializeHistories(data.conversationHistories);
  }, [data, initializeHistories]);

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
    if (deleteTargetId === null) return;

    deleteHistory(deleteTargetId);
    setIsDeleteMode(false);
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

      <ConversationHistoryList
        histories={histories}
        isDeleteMode={isDeleteMode}
        onSelect={handleSelectHistory}
        onDelete={handleDeleteClick}
      />

      <ConfirmModal
        isOpen={deleteTargetId !== null}
        message={CONVERSATION_HISTORY_MESSAGE.DELETE_CONFIRM}
        onConfirm={handleConfirmDelete}
        onCancel={() => {}}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};

export default ConversationHistoryPage;
