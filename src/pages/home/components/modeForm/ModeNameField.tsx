interface ModeNameFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ModeNameField = ({ label, value, onChange }: ModeNameFieldProps) => {
  return (
    <label>
      <strong>{label}</strong>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="예: 주방"
      />
    </label>
  );
};

export default ModeNameField;
