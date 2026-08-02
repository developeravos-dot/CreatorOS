import type {
  ReactNode,
} from "react";

import {
  useForm,
} from "./FormContext";

interface SwitchProps {
  name: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export default function Switch({
  name,
  label,
  description,
  disabled = false,
}: SwitchProps) {
  const {
    values,
    pending,
    setValue,
    setTouched,
  } = useForm();

  const checked =
    Boolean(
      values[name],
    );

  const labelId =
    `cos-field-${name}-label`;

  return (
    <label className="cos-switch">
      <input
        name={name}
        type="checkbox"
        role="switch"
        disabled={
          disabled ||
          pending
        }
        checked={checked}
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

      <span
        className="cos-switch__track"
        aria-hidden="true"
      >
        <span />
      </span>

      <span className="cos-switch__content">
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
