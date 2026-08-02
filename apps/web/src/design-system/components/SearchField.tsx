interface SearchFieldProps {
  value: string;
  placeholder?: string;
  disabled?: boolean;
  ariaLabel?: string;

  onChange: (
    value: string,
  ) => void;
}

export default function SearchField({
  value,
  placeholder = "Search...",
  disabled = false,
  ariaLabel = "Search",
  onChange,
}: SearchFieldProps) {
  return (
    <label className="cos-search-field">
      <span aria-hidden="true">
        ⌕
      </span>

      <input
        type="search"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
      />

      {value ? (
        <button
          type="button"
          aria-label="Clear search"
          disabled={disabled}
          onClick={() =>
            onChange("")
          }
        >
          ×
        </button>
      ) : null}
    </label>
  );
}
