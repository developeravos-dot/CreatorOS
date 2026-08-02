import type {
  ReactNode,
} from "react";

import {
  useForm,
} from "./FormContext";

interface CheckboxProps {
  name: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export default function Checkbox({
  name,
  label,
  description,
  disabled = false,
}: CheckboxProps) {
  const {
    values,
    pending,
    setValue,
    setTouched,
  } = useForm();

  const id =
    `cos-field-${name}`;

  const labelId =
    `${id}-label`;

  return (
    <label
      className="cos-checkbox"
      htmlFor={id}
    >
      <input
        id={id}
        name={name}
        type="checkbox"
        disabled={
          disabled ||
          pending
        }
        checked={Boolean(
          values[name],
        )}
        aria-labelledby={
          labelId
        }
        onChange={(
          event,
        ) => {
          setValue(
            name,
            event.target.checked,
          );

          setTouched(name);
        }}
      />

      <span className="cos-checkbox__indicator">
        ✓
      </span>

      <span className="cos-checkbox__content">
        <strong id={labelId}>
          {label}
        </strong>

        {description ? (
          <small>
            {description}
          </small>
        ) : null}
      </span>
    </label>
  );
}
