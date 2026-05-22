import type { ChangeEvent } from 'react';

interface InputPropTypes {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

const Input = ({ label, value, placeholder, onChange }: InputPropTypes) => {
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
        className="w-full rounded-xl border border-neutral-300 px-5 py-4 text-base font-bold outline-none placeholder:text-neutral-400 focus:border-neutral-900"
      />
    </label>
  );
};

export default Input;
