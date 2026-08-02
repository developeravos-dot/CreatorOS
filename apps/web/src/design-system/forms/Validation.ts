export type ValidationResult =
  | string
  | undefined;

export type Validator<T = unknown> = (
  value: T,
  values: Record<string, unknown>,
) =>
  | ValidationResult
  | Promise<ValidationResult>;

export type FormValidators =
  Record<
    string,
    Validator<unknown>[]
  >;

export type FormErrors =
  Record<
    string,
    string | undefined
  >;

function isEmpty(
  value: unknown,
): boolean {
  return (
    value === undefined ||
    value === null ||
    value === "" ||
    (
      Array.isArray(value) &&
      value.length === 0
    )
  );
}

export function required(
  message =
    "This field is required.",
): Validator {
  return (value) =>
    isEmpty(value)
      ? message
      : undefined;
}

export function minLength(
  minimum: number,
  message =
    `Minimum length is ${minimum}.`,
): Validator {
  return (value) => {
    if (isEmpty(value)) {
      return undefined;
    }

    return String(value).length <
      minimum
      ? message
      : undefined;
  };
}

export function maxLength(
  maximum: number,
  message =
    `Maximum length is ${maximum}.`,
): Validator {
  return (value) => {
    if (isEmpty(value)) {
      return undefined;
    }

    return String(value).length >
      maximum
      ? message
      : undefined;
  };
}

export function email(
  message =
    "Enter a valid email address.",
): Validator {
  const pattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return (value) => {
    if (isEmpty(value)) {
      return undefined;
    }

    return pattern.test(
      String(value),
    )
      ? undefined
      : message;
  };
}

export function url(
  message =
    "Enter a valid URL.",
): Validator {
  return (value) => {
    if (isEmpty(value)) {
      return undefined;
    }

    try {
      new URL(
        String(value),
      );

      return undefined;
    } catch {
      return message;
    }
  };
}

export function regex(
  pattern: RegExp,
  message =
    "The value format is invalid.",
): Validator {
  return (value) => {
    if (isEmpty(value)) {
      return undefined;
    }

    pattern.lastIndex = 0;

    return pattern.test(
      String(value),
    )
      ? undefined
      : message;
  };
}

export function compose(
  ...validators:
    Validator[]
): Validator {
  return async (
    value,
    values,
  ) => {
    for (
      const validator
      of validators
    ) {
      const result =
        await validator(
          value,
          values,
        );

      if (result) {
        return result;
      }
    }

    return undefined;
  };
}

export async function validateField(
  value: unknown,
  validators:
    Validator<unknown>[] = [],
  values:
    Record<string, unknown> = {},
): Promise<ValidationResult> {
  for (
    const validator
    of validators
  ) {
    const result =
      await validator(
        value,
        values,
      );

    if (result) {
      return result;
    }
  }

  return undefined;
}

export async function validateForm(
  values:
    Record<string, unknown>,
  validators:
    FormValidators,
): Promise<FormErrors> {
  const errors:
    FormErrors = {};

  for (
    const [
      name,
      fieldValidators,
    ]
    of Object.entries(
      validators,
    )
  ) {
    errors[name] =
      await validateField(
        values[name],
        fieldValidators,
        values,
      );
  }

  return errors;
}

export function hasValidationErrors(
  errors: FormErrors,
): boolean {
  return Object.values(
    errors,
  ).some(Boolean);
}
