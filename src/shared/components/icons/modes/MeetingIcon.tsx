interface MeetingIconPropTypes {
  className?: string;
}

// TODO(placeholder): 실제 디자인 SVG path로 교체 (이 컴포넌트의 <svg> 내부만 바꾸면 됨)
const MeetingIcon = ({ className }: MeetingIconPropTypes) => (
  <svg
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="14" r="4" fill="currentColor" opacity="0.4" />
    <circle cx="24" cy="14" r="4" fill="currentColor" opacity="0.4" />
    <path
      d="M6 28 Q12 20 18 28 Q24 20 30 28"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      opacity="0.4"
    />
  </svg>
);

export default MeetingIcon;
