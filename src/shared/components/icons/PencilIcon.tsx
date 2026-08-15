interface PencilIconPropTypes {
  className?: string;
}

const PencilIcon = ({ className }: PencilIconPropTypes) => (
  <svg
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M1.10819 16.5012C0.786438 16.5778 0.506822 16.4974 0.26934 16.2599C0.0318574 16.0224 -0.0485801 15.7428 0.028027 15.421L0.832402 11.5141L5.01515 15.6968L1.10819 16.5012ZM6.50899 14.5707L1.95853 10.0202L11.4502 0.528589C11.8025 0.176196 12.2392 0 12.7601 0C13.2811 0 13.7177 0.176196 14.0701 0.528589L16.0006 2.45909C16.353 2.81148 16.5292 3.24814 16.5292 3.76907C16.5292 4.29 16.353 4.72666 16.0006 5.07905L6.50899 14.5707Z"
      fill="currentColor"
    />
  </svg>
);

export default PencilIcon;
