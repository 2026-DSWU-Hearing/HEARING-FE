import { useId } from 'react';
import type { ChangeEvent } from 'react';

interface TextInputPropTypes {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  errorMessage?: string;
  maxLength?: number;
}

const TextInput = ({
  label,
  value,
  placeholder,
  onChange,
  errorMessage,
  maxLength,
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
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        aria-describedby={hasError ? errorId : undefined}
        aria-invalid={hasError ? true : undefined}
        className={`body-lg-regular w-full rounded-xl border bg-neutral-900 px-5 py-4 text-primary outline-none transition-colors placeholder:text-tertiary ${borderClassName}`}
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
