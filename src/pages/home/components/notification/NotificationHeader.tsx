import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

import TopNavigation from '@/layout/TopNavigation';

interface NotificationHeaderPropTypes {
  // 삭제(선택) 모드 여부. true 면 헤더 아래 '전체 선택 / 닫기' 행을 노출한다.
  isDeleteMode: boolean;
  // 쓰레기통 아이콘 노출 여부(빈 목록 화면에서는 숨긴다).
  hasNotifications: boolean;
  // 선택된 항목이 하나라도 있는지(쓰레기통 색을 빨강으로 바꾸는 기준).
  hasSelection: boolean;
  // 모든 항목이 선택됐는지(전체 선택/해제 토글 라벨 기준).
  isAllSelected: boolean;
  isDisabled: boolean;
  onTrashClick: () => void;
  onSelectAll: () => void;
  onCloseDeleteMode: () => void;
}

const NotificationHeader = ({
  isDeleteMode,
  hasNotifications,
  hasSelection,
  isAllSelected,
  isDisabled,
  onTrashClick,
  onSelectAll,
  onCloseDeleteMode,
}: NotificationHeaderPropTypes) => {
  // 쓰레기통 색은 3가지 상태로 나뉜다.
  // - 일반 모드(삭제모드 진입 전): 기본색
  // - 삭제 모드 + 선택 없음: 비활성색(아직 삭제할 게 없음)
  // - 삭제 모드 + 선택 있음: 경고색(삭제 가능 강조)
  const getTrashColorClassName = () => {
    if (!isDeleteMode) {
      return 'text-primary';
    }
    return hasSelection ? 'text-state-alert' : 'text-disabled';
  };

  const trashColorClassName = getTrashColorClassName();
  const trashAriaLabel = !isDeleteMode
    ? '삭제할 알림 선택'
    : hasSelection
      ? '선택한 알림 삭제'
      : '삭제 모드 닫기';

  return (
    // relative: 삭제모드 액션 행을 TopNavigation 의 mb-2xl 여백 공간 안에 absolute 로 겹쳐 넣기 위한 기준점.
    <div className="relative flex flex-col">
      <TopNavigation
        title="알림"
        // 알림이 없으면 쓰레기통 자체를 숨긴다(빈 목록 화면).
        rightIconButton={
          hasNotifications
            ? {
                icon: faTrashCan,
                onClick: onTrashClick,
                ariaLabel: trashAriaLabel,
                colorClassName: trashColorClassName,
              }
            : undefined
        }
        isRightDisabled={isDisabled}
      />

      {/* 삭제모드일 때만: 전체 선택 / 닫기 액션 행.
          디자인 의도상 이 행은 아래 목록을 밀어내지 않고 TopNavigation 의 하단 여백 안에 들어간다.
          top = pt-[2.75rem](상단 패딩) + 1.5rem(제목 행 높이) + 0.81rem(제목 행 바로 아래 간격). */}
      {isDeleteMode && (
        <div className="absolute right-[1.06rem] top-[5.06rem] flex gap-base">
          <button
            type="button"
            onClick={onSelectAll}
            disabled={isDisabled}
            className="body-sm-regular text-secondary disabled:cursor-wait disabled:text-disabled"
          >
            {isAllSelected ? '전체 해제' : '전체 선택'}
          </button>
          <button
            type="button"
            onClick={onCloseDeleteMode}
            disabled={isDisabled}
            className="body-sm-regular text-secondary disabled:cursor-wait disabled:text-disabled"
          >
            닫기
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationHeader;
