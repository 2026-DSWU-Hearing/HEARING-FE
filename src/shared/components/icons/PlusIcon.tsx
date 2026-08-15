interface PlusIconPropTypes {
  className?: string;
}

const PlusIcon = ({ className }: PlusIconPropTypes) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g clipPath="url(#clip0_1312_5795)">
      <path
        d="M24.0003 17.3332H17.3337V23.9998C17.3337 24.7332 16.7337 25.3332 16.0003 25.3332C15.267 25.3332 14.667 24.7332 14.667 23.9998V17.3332H8.00033C7.26699 17.3332 6.66699 16.7332 6.66699 15.9998C6.66699 15.2665 7.26699 14.6665 8.00033 14.6665H14.667V7.99984C14.667 7.2665 15.267 6.6665 16.0003 6.6665C16.7337 6.6665 17.3337 7.2665 17.3337 7.99984V14.6665H24.0003C24.7337 14.6665 25.3337 15.2665 25.3337 15.9998C25.3337 16.7332 24.7337 17.3332 24.0003 17.3332Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_1312_5795">
        <rect width="32" height="32" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default PlusIcon;
