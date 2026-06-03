interface Props {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}
export default function FilterSelect({
  value,
  onChange,
  options,
}: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map(option => (
        <option key={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
