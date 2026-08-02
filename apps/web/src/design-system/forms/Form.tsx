import type {
  FormEvent,
  ReactNode,
} from "react";

import {
  useForm,
} from "./FormContext";

interface FormProps {
  children: ReactNode;
  className?: string;
  noValidate?: boolean;
}

export default function Form({
  children,
  className = "",
  noValidate = true,
}: FormProps) {
  const {
    submit,
    pending,
    succeeded,
    submitError,
  } = useForm();

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    await submit();
  }

  return (
    <form
      className={[
        "cos-form",
        pending
          ? "cos-form--pending"
          : "",
        succeeded
          ? "cos-form--success"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      noValidate={noValidate}
      aria-busy={pending}
      onSubmit={
        handleSubmit
      }
    >
      {children}

      {submitError ? (
        <div
          className="cos-form__submit-error"
          role="alert"
        >
          {submitError}
        </div>
      ) : null}
    </form>
  );
}
