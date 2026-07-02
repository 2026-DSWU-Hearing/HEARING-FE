import type { ButtonHTMLAttributes, ComponentType, SVGProps } from 'react';
import { twMerge } from 'tailwind-merge';

interface DisabilityOptionButtonPropTypes extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  isSelected: boolean;
}

const DisabilityOptionButton = ({
  label,
  Icon,
  isSelected,

  className,
  ...props
}: DisabilityOptionButtonPropTypes) => {
  return (
    <button
      type="button"
      className={twMerge(
        'flex flex-1 self-stretch rounded-xl p-xs',
        'flex-col items-center justify-center',
        'border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.16)] backdrop-blur-sm',
        isSelected ? 'card-true' : 'card-false',
        className,
      )}
      {...props}
    >
      <div className="flex h-full flex-col items-center justify-center gap-base">
        <span className="flex h-[50px] w-[50px] items-center justify-center">
          <Icon
            className={twMerge(
              'h-[46px] w-[40px] text-secondary',
              isSelected &&
                'text-primary-100 drop-shadow-[0_0_10px_rgb(255_249_212_/_50%)]',
            )}
          />
        </span>

        <span
          className={twMerge(
            'heading-xl-semibold text-center text-secondary',
            isSelected && 'text-primary-100',
          )}
        >
          {label}
        </span>
      </div>
    </button>
  );
};

export default DisabilityOptionButton;
