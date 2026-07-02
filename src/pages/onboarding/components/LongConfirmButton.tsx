import type { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface LongConfirmButtonPropTypes extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
}

const LongConfirmButton = ({
  children,
  className,
  ...props
}: LongConfirmButtonPropTypes) => {
  return (
    <button
      type="button"
      className={twMerge(
        'caption-xs-semibold h-[48px] w-full rounded-pill bg-primary-400 text-neutral-950 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-disabled disabled:text-neutral-800',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default LongConfirmButton;
