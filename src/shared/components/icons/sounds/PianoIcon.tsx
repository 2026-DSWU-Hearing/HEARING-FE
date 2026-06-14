interface PianoIconPropTypes {
  className?: string;
}

// 디자인 시안(ic_piano.svg)을 컴포넌트화. fill="currentColor"라서
// 부모의 text-* 색상을 그대로 따라간다.
const PianoIcon = ({ className }: PianoIconPropTypes) => (
  <svg
    viewBox="0 0 30 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 3C0 1.34314 1.34314 0 3 0H7.5H10.5H16.5H19.5H25.5H27C28.6569 0 30 1.34314 30 3V15V24C30 25.6569 28.6569 27 27 27H19.5H10.5H3C1.34314 27 0 25.6569 0 24V3ZM27 16.5H25.5C24.6716 16.5 24 15.8285 24 15V3H21V15V24H27V16.5ZM18 24V16.5H16.5C15.6715 16.5 15 15.8285 15 15V3H12V15V24H18ZM9 24V16.5H7.5C6.67158 16.5 6 15.8285 6 15V3H3V24H9Z"
      fill="currentColor"
    />
  </svg>
);

export default PianoIcon;
