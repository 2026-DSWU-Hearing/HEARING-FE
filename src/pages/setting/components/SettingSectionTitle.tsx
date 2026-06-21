interface SettingSectionTitlePropTypes {
  title: string;
  actionLabel?: string;
  onActionClick?: () => void;
}

// 설정 페이지 섹션 제목 행.
// 제목 + (선택) 우측 액션 버튼으로 구성한다.
// 나의 디바이스(연결 해제하기)·진동 강도 설정(액션 없음) 등에서 재사용한다.

const SettingSectionTitle = ({
  title,
  actionLabel,
  onActionClick,
}: SettingSectionTitlePropTypes) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="heading-lg-semibold text-primary">{title}</h2>
      {actionLabel && onActionClick && (
        <button
          type="button"
          onClick={onActionClick}
          className="body-small-regular text-primary-400"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default SettingSectionTitle;
