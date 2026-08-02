import type {
  ReactNode,
  SelectHTMLAttributes,
} from "react";

import FormField from "./FormField";

import {
  useForm,
} from "./FormContext";

export interface FormSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps
  extends Omit<
    SelectHTMLAttributes<HTMLSelectElement>,
    "name" |
    "value" |
    "onChange"
  > {
  name: string;
  label?: ReactNode;
  helperText?: ReactNode;
  options:
    FormSelectOption[];
}

export default function Select({
  name,
  label,
  helperText,
  options,
  required,
  disabled,
  ...selectProps
}: SelectProps) {
  const {
    values,
    errors,
    touched,
    pending,
    setValue,
    setTouched,
    validateField,
  } = useForm();

  const id =
    selectProps.id ??
    `cos-field-${name}`;

  const visibleError =
    touched[name]
      ? errors[name]
      : undefined;

  return (
    <FormField
      id={id}
      label={label}
      required={required}
      helperText={helperText}
      error={visibleError}
    >
      <select
        {...selectProps}
        id={id}
        name={name}
        required={required}
        disabled={
          disabled ||
          pending
        }
        className="cos-form-control"
        value={String(
          values[name] ?? "",
        )}
        aria-invalid={
          Boolean(
            visibleError,
          )
        }
        onChange={(
          event,
        ) =>
          setValue(
            name,
            event.target.value,
          )
        }
        onBlur={() => {
          setTouched(name);

          void validateField(
            name,
          );
        }}
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
              disabled={
                option.disabled
              }
            >
              {option.label}
            </option>
          ),
        )}
      </select>
    </FormField>
  );
}
