interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <label>
      <span className="sr-only">소리 검색</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="원하는 소리를 검색하세요"
      />
      <span aria-hidden="true">검색</span>
    </label>
  );
};

export default SearchBar;
