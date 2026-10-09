interface NotificationToggleBarPropTypes {
  title: string;
  isOn: boolean;
  onToggle: () => void;
  /** 제목 아래에 덧붙일 안내 문구. 미지정 시 표시하지 않는다. */
  description?: string;
}

const NotificationToggleBar = ({
  title,
  isOn,
  onToggle,
  description,
}: NotificationToggleBarPropTypes) => {
  return (
    <div className="flex items-center justify-between gap-base rounded-xl bg-neutral-900 px-lg py-lg">
      <div className="flex flex-col gap-xxs">
        <span className="body-lg-regular text-primary">{title}</span>
        {description && (
          <span className="body-sm-regular text-secondary">{description}</span>
        )}
      </div>

      {/* 토글(스위치) 영역만 label로 감싸 이 부분에서만 클릭이 동작하게 한다 */}
      <label
        className="relative block h-7 w-[3.25rem] shrink-0 cursor-pointer"
        aria-label={title}
      >
        {/* 시각적으로만 숨긴 네이티브 체크박스. 상태/키보드(Space)/접근성은 브라우저가 처리 */}
        <input
          type="checkbox"
          checked={isOn}
          onChange={onToggle}
          className="peer sr-only"
        />

        {/* 중앙 정렬 계산을 사용하지 않고 트랙과 thumb 사이 간격을 2px로 고정한다. */}
        <span
          className="absolute inset-0 rounded-pill bg-disabled transition-colors duration-200 peer-checked:bg-state-active"
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute top-0.5 left-0.5 h-6 w-6 rounded-pill bg-white transition-transform duration-300 ease-in-out peer-checked:translate-x-6"
          aria-hidden="true"
        />
      </label>
    </div>
  );
};

export default NotificationToggleBar;
