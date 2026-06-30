import { useState } from 'react';

import NotificationHeader from '@/pages/home/components/notification/NotificationHeader';
import NotificationList from '@/pages/home/components/notification/NotificationList';
import { NOTIFICATION_MOCK } from '@/pages/home/constants/notificationMock';

const NotificationPage = () => {
  // TODO(api): GET 알림 목록 API 연동 시 mock 대신 서버 데이터로 초기화한다.
  const [notifications, setNotifications] = useState(NOTIFICATION_MOCK);
  // 삭제(선택) 모드 여부.
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  // 선택된 알림 id 집합. 불변성을 위해 갱신 시 항상 새 Set 을 만든다.
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const hasNotifications = notifications.length > 0;
  const hasSelection = selectedIds.size > 0;
  // 목록이 비어있지 않으면서 모든 항목이 선택된 상태인지(전체 선택/해제 토글 라벨 기준).
  const isAllSelected =
    hasNotifications && selectedIds.size === notifications.length;

  // 삭제(선택) 모드를 빠져나가며 선택을 비운다. '닫기' 및 삭제 완료 후 공통으로 쓴다.
  const closeDeleteMode = () => {
    setIsDeleteMode(false);
    setSelectedIds(new Set());
  };

  // 쓰레기통 클릭: 상태에 따라 3갈래로 분기한다.
  const handleTrashClick = () => {
    // 일반 모드 → 삭제(선택) 모드 진입.
    if (!isDeleteMode) {
      setIsDeleteMode(true);
      return;
    }

    // 삭제 모드 + 선택 있음 → 선택 항목 삭제.
    if (hasSelection) {
      // TODO(api): DELETE 알림 API 호출로 선택 항목을 서버에서도 삭제한다.
      setNotifications((prev) =>
        prev.filter((notification) => !selectedIds.has(notification.id)),
      );
      closeDeleteMode();
      return;
    }

    // 삭제 모드 + 선택 없음 → 모드만 종료.
    closeDeleteMode();
  };

  // 전체 선택 토글: 이미 전부 선택돼 있으면 해제, 아니면 전부 선택.
  const handleSelectAll = () => {
    setSelectedIds(
      isAllSelected
        ? new Set()
        : new Set(notifications.map((notification) => notification.id)),
    );
  };

  // 개별 알림 선택 토글.
  const handleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="flex min-h-dvh flex-col pb-[9.5rem]">
      <NotificationHeader
        isDeleteMode={isDeleteMode}
        hasNotifications={hasNotifications}
        hasSelection={hasSelection}
        isAllSelected={isAllSelected}
        onTrashClick={handleTrashClick}
        onSelectAll={handleSelectAll}
        onCloseDeleteMode={closeDeleteMode}
      />

      <NotificationList
        notifications={notifications}
        isDeleteMode={isDeleteMode}
        selectedIds={selectedIds}
        onSelect={handleSelect}
      />
    </div>
  );
};

export default NotificationPage;
