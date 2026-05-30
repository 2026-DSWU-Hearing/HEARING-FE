import { useId } from 'react';
import type { ChangeEvent } from 'react';

interface InputPropTypes {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  errorMessage?: string;
}

const Input = ({
  label,
  value,
  placeholder,
  onChange,
  errorMessage,
}: InputPropTypes) => {
  const errorId = useId();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <label className="block">
      <span className="mb-4 block text-xl font-bold">{label}</span>
      <input
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        aria-describedby={errorMessage ? errorId : undefined}
        aria-invalid={errorMessage ? true : undefined}
        className="w-full rounded-xl border border-neutral-300 px-5 py-4 text-base font-bold outline-none placeholder:text-neutral-400 focus:border-neutral-900"
      />
      {errorMessage && (
        <p
          id={errorId}
          role="alert"
          className="mt-2 text-sm font-bold text-red-500"
        >
          {errorMessage}
        </p>
      )}
    </label>
  );
};

export default Input;
