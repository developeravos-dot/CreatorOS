import type {
  ReactNode,
} from "react";

interface FormFieldProps {
  id: string;
  label?: ReactNode;
  children: ReactNode;
  helperText?: ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
}

export default function FormField({
  id,
  label,
  children,
  helperText,
  error,
  required = false,
  className = "",
}: FormFieldProps) {
  return (
    <div
      className={[
        "cos-form-field",
        error
          ? "cos-form-field--error"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label ? (
        <label
          className="cos-form-field__label"
          htmlFor={id}
        >
          {label}

          {required ? (
            <span
              aria-hidden="true"
            >
              *
            </span>
          ) : null}
        </label>
      ) : null}

      {children}

      {error ? (
        <span
          className="cos-form-field__error"
          id={`${id}-error`}
          role="alert"
        >
          {error}
        </span>
      ) : helperText ? (
        <span
          className="cos-form-field__helper"
          id={`${id}-helper`}
        >
          {helperText}
        </span>
      ) : null}
    </div>
  );
}
