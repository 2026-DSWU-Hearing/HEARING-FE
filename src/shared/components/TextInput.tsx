import { useId } from 'react';
import type { ChangeEvent } from 'react';
import { twMerge } from 'tailwind-merge';

interface TextInputPropTypes {
  label?: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  errorMessage?: string;
  maxLength?: number;
  /**
   * input 요소 스타일 오버라이드 (배경·패딩·radius·높이 등).
   * twMerge로 기본 클래스와 병합되어 충돌하는 그룹은 이 값이 이긴다.
   */
  inputClassName?: string;
}

const TextInput = ({
  label,
  value,
  placeholder,
  onChange,
  errorMessage,
  maxLength,
  inputClassName,
}: TextInputPropTypes) => {
  const errorId = useId();

  const hasError = Boolean(errorMessage);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const borderClassName = hasError
    ? 'border-state-alert'
    : 'border-neutral-800';

  return (
    <label className="block">
      <span className="heading-base-semibold mb-xs block text-secondary">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        aria-describedby={hasError ? errorId : undefined}
        aria-invalid={hasError ? true : undefined}
        className={twMerge(
          'body-lg-regular w-full rounded-xl border bg-neutral-900 px-5 py-4 text-primary outline-none transition-colors placeholder:text-tertiary',
          borderClassName,
          inputClassName,
        )}
      />
      <div className="mt-2 flex items-start justify-between gap-2">
        {errorMessage ? (
          <p
            id={errorId}
            role="alert"
            className="caption-xs-regular text-state-alert"
          >
            {errorMessage}
          </p>
        ) : (
          <span />
        )}
        {maxLength !== undefined && (
          <span className="caption-xs-regular shrink-0 text-tertiary">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </label>
  );
};

export default TextInput;
