import type {
  ReactNode,
  TextareaHTMLAttributes,
} from "react";

import FormField from "./FormField";

import {
  useForm,
} from "./FormContext";

interface TextAreaProps
  extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "name" |
    "value" |
    "onChange"
  > {
  name: string;
  label?: ReactNode;
  helperText?: ReactNode;
}

export default function TextArea({
  name,
  label,
  helperText,
  required,
  disabled,
  rows = 5,
  ...textareaProps
}: TextAreaProps) {
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
    textareaProps.id ??
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
      <textarea
        {...textareaProps}
        id={id}
        name={name}
        required={required}
        rows={rows}
        disabled={
          disabled ||
          pending
        }
        className="cos-form-control cos-form-control--textarea"
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
      />
    </FormField>
  );
}
