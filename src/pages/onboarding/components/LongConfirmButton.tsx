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
        'flex h-[42px] w-full items-center justify-center gap-[10px] self-stretch rounded-pill bg-primary-400 px-0 py-xs transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-disabled',
        className,
      )}
      {...props}
    >
      <span className="heading-base-semibold flex flex-1 flex-col justify-center self-stretch text-center text-neutral-800">
        {children}
      </span>
    </button>
  );
};

export default LongConfirmButton;
