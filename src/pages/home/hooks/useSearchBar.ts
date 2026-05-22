import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useThrottleValue } from '@/shared/hooks/useThrottleValue';

interface UseSearchBarParamTypes {
  value: string;
  throttleDelay: number;
  onChange: (value: string) => void;
}

export const useSearchBar = ({
  value,
  throttleDelay,
  onChange,
}: UseSearchBarParamTypes) => {
  const [inputValue, setInputValue] = useState(value);
  const throttledInputValue = useThrottleValue(inputValue, throttleDelay);

  // 입력창은 즉시 반영하고, 부모에는 throttle이 적용된 값만 전달한다.
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

  return {
    inputValue,
    handleSearchInputChange,
  };
};
