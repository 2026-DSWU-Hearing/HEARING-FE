import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useThrottleValue } from '@/shared/hooks/useThrottleValue';

interface SearchBarPropTypes {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  throttleDelay?: number;
}

const SearchBar = ({
  value,
  placeholder,
  onChange,
  throttleDelay = 300,
}: SearchBarPropTypes) => {
  const [inputValue, setInputValue] = useState(value);
  const throttledInputValue = useThrottleValue(inputValue, throttleDelay);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    onChange(throttledInputValue);
  }, [onChange, throttledInputValue]);

  const handleSearchInputChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setInputValue(event.target.value);
  };

  return (
    <label className="flex items-center rounded-full bg-neutral-100 px-4 py-3">
      <input
        value={inputValue}
        onChange={handleSearchInputChange}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-base font-semibold outline-none placeholder:text-neutral-400"
      />
      <span className="text-2xl text-neutral-600">⌕</span>
    </label>
  );
};

export default SearchBar;
