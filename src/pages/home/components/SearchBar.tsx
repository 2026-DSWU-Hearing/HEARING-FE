import { useSearchBar } from '@/pages/home/hooks/useSearchBar';

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
  const { inputValue, handleSearchInputChange } = useSearchBar({
    value,
    throttleDelay,
    onChange,
  });

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
