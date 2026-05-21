import type { ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';

interface AddBtnPropTypes
  extends Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'disabled'> {
  label: string;
  to?: string;
  onClick?: () => void;
  className?: string;
}

const AddBtn = ({
  label,
  to,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}: AddBtnPropTypes) => {
  const buttonClassName = `inline-flex items-center gap-4 rounded-xl bg-gray-300 px-5 py-3 text-base font-bold text-neutral-800 ${className}`;
  const content = (
    <>
      <span>{label}</span>
      <span className="text-2xl leading-none">+</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={buttonClassName}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClassName}
    >
      {content}
    </button>
  );
};

export default AddBtn;
