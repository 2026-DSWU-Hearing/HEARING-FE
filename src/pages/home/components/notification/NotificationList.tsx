import NotificationBar from '@/pages/home/components/notification/NotificationBar';
import type { NotificationItemTypes } from '@/pages/home/types/notificationTypes';

interface NotificationListPropTypes {
  notifications: NotificationItemTypes[];
  isDeleteMode: boolean;
  selectedIds: Set<number>;
  onSelect: (id: number) => void;
}

const NotificationList = ({
  notifications,
  isDeleteMode,
  selectedIds,
  onSelect,
}: NotificationListPropTypes) => {
  // 알림이 하나도 없으면 빈 상태 문구를 보여준다.
  if (notifications.length === 0) {
    return (
      <p className="body-sm-regular pt-[1rem] text-center text-secondary">
        받은 알림이 없어요.
      </p>
    );
  }

  return (
    <ul
      className={`flex flex-col gap-base px-[1.34rem] transition-[padding] duration-200 ease-out ${
        // 삭제모드에선 헤더의 액션 행(absolute)과 목록이 0.81rem 떨어지도록 위 여백을 준다.
        isDeleteMode ? 'pt-[0.81rem]' : ''
      }`}
    >
      {notifications.map((notification) => (
        <li key={notification.id}>
          <NotificationBar
            notification={notification}
            isDeleteMode={isDeleteMode}
            isSelected={selectedIds.has(notification.id)}
            onSelect={onSelect}
          />
        </li>
      ))}
    </ul>
  );
};

export default NotificationList;
