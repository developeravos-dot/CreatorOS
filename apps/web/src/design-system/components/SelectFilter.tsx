export interface SelectFilterOption {
  value: string;
  label: string;
}

interface SelectFilterProps {
  value: string;
  label: string;

  options:
    SelectFilterOption[];

  disabled?: boolean;

  onChange: (
    value: string,
  ) => void;
}

export default function SelectFilter({
  value,
  label,
  options,
  disabled = false,
  onChange,
}: SelectFilterProps) {
  return (
    <label className="cos-select-filter">
      <span>{label}</span>

      <select
        value={value}
        disabled={disabled}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
      >
        {options.map(
          (option) => (
            <option
              key={
                option.value
              }
              value={
                option.value
              }
            >
              {option.label}
            </option>
          ),
        )}
      </select>
    </label>
  );
}
