import type {
  InputHTMLAttributes,
  ReactNode,
} from "react";

import FormField from "./FormField";

import {
  useForm,
} from "./FormContext";

interface TextInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "name" |
    "value" |
    "onChange"
  > {
  name: string;
  label?: ReactNode;
  helperText?: ReactNode;
}

export default function TextInput({
  name,
  label,
  helperText,
  required,
  disabled,
  ...inputProps
}: TextInputProps) {
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
    inputProps.id ??
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
      <input
        {...inputProps}
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
        aria-describedby={
          visibleError
            ? `${id}-error`
            : helperText
              ? `${id}-helper`
              : undefined
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
      />
    </FormField>
  );
}
