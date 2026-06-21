import { useState } from 'react';

import eyeCloseIcon from '@/shared/assets/icons/login/eye-close.png';
import eyeOpenIcon from '@/shared/assets/icons/login/eye-open.png';

interface PasswordInputPropTypes {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput = ({ value, onChange }: PasswordInputPropTypes) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handlePasswordVisibilityToggleClick = () => {
    setIsPasswordVisible(
      (previousIsPasswordVisible) => !previousIsPasswordVisible,
    );
  };

  return (
    <div className="relative">
      <input
        id="password"
        name="password"
        className="body-base-regular mb-base h-[48px] w-full rounded-lg border border-neutral-800 bg-neutral-900 px-base pr-[48px] text-primary outline-none placeholder:text-disabled focus:border-primary-400"
        type={isPasswordVisible ? 'text' : 'password'}
        placeholder="password"
        value={value}
        onChange={onChange}
      />

      <button
        className="absolute right-sm top-0 flex h-[48px] w-[32px] items-center justify-center border-0 bg-transparent"
        type="button"
        aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
        onClick={handlePasswordVisibilityToggleClick}
      >
        <img
          className="h-icon-md w-icon-md object-contain"
          src={isPasswordVisible ? eyeCloseIcon : eyeOpenIcon}
          alt=""
          aria-hidden="true"
        />
      </button>
    </div>
  );
};

export default PasswordInput;
