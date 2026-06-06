import type { ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import AddIcon from '@/shared/components/icons/AddIcon';

interface AddButtonPropTypes extends Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'disabled'
> {
  label: string;
  to?: string;
  onClick?: () => void;
  className?: string;
}
// 추가하기 버튼 공통 컴포넌트
const AddButton = ({
  label,
  to,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}: AddButtonPropTypes) => {
  // 버튼 스타일링
  const buttonClassName = `inline-flex items-center gap-[0.625rem] rounded-pill bg-[#5354504D]/30 px-sm py-xs h-[1.6rem] text-secondary caption-xs-medium border-1 border-neutral-700 ${className}`;
  const content = (
    <>
      <span>{label}</span>
      <AddIcon className="h-[1rem] w-[1rem]" />
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

export default AddButton;
