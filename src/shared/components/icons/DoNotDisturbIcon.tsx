interface DoNotDisturbIconPropTypes {
  className?: string;
}

const DoNotDisturbIcon = ({ className }: DoNotDisturbIconPropTypes) => (
  <svg
    viewBox="0 0 16 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M8.72219 0.612884C8.86213 0.315519 8.61724 -0.01683 8.28489 0.000662093C3.03727 0.263043 -0.872204 5.0996 0.168574 10.4609C0.850764 13.9856 3.7457 16.7756 7.28784 17.344C10.8475 17.9213 14.0835 16.347 15.9202 13.7144C16.1038 13.4433 15.9552 13.0585 15.6316 13.0235C9.73673 12.3588 6.12462 6.06166 8.72219 0.612884Z"
      fill="currentColor"
    />
  </svg>
);

export default DoNotDisturbIcon;
