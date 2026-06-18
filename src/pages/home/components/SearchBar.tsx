import { useSearchBar } from '@/pages/home/hooks/useSearchBar';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
    <label className="flex items-center rounded-full bg-neutral-700 h-[2.25rem] p-base gap-sm border-neutral-600 border-[1px]">
      <input
        value={inputValue}
        onChange={handleSearchInputChange}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent body-sm-regular outline-none placeholder:text-tertiary"
      />
      <span className="w-[1rem] text-secondary">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </span>
    </label>
  );
};

export default SearchBar;
