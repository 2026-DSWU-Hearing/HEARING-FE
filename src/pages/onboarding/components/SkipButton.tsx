import type { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

type SkipButtonPropTypes = ButtonHTMLAttributes<HTMLButtonElement>;

const SkipButton = ({ className, ...props }: SkipButtonPropTypes) => {
  return (
    <button
      type="button"
      className={twMerge(
        'body-base-regular text-center text-tertiary',
        className,
      )}
      {...props}
    >
      나중에 하기
    </button>
  );
};

export default SkipButton;
