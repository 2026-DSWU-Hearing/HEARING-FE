interface UnknownModeIconPropTypes {
  className?: string;
}

// 매핑되지 않은 icon_key(미지정/레거시 값)가 들어올 때 화면이 깨지지 않도록 하는 fallback 아이콘.
const UnknownModeIcon = ({ className }: UnknownModeIconPropTypes) => (
  <svg
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle
      cx="18"
      cy="18"
      r="13"
      stroke="currentColor"
      strokeWidth="2"
      strokeDasharray="3 3"
      opacity="0.4"
    />
    <path
      d="M14 14.5C14 12.5 15.8 11 18 11C20.2 11 22 12.5 22 14.5C22 16.5 18 16.8 18 19.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="18" cy="24" r="1.4" fill="currentColor" />
  </svg>
);

export default UnknownModeIcon;
