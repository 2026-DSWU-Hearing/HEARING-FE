import type { ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';

interface AddBtnPropTypes extends Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'disabled'
> {
  label: string;
  to?: string;
  onClick?: () => void;
  className?: string;
}
// 추가하기 버튼 공통 컴포넌트
const AddBtn = ({
  label,
  to,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}: AddBtnPropTypes) => {
  // 버튼 스타일링
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
