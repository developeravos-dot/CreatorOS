import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  hasValidationErrors,
  validateField as runFieldValidation,
  validateForm,
  type FormErrors,
  type FormValidators,
} from "./Validation";

export type FormValues =
  Record<string, unknown>;

export interface FormContextValue {
  values: FormValues;
  errors: FormErrors;

  touched:
    Record<string, boolean>;

  dirty: boolean;
  pending: boolean;
  succeeded: boolean;

  submitError:
    string | null;

  setValue: (
    name: string,
    value: unknown,
  ) => void;

  setTouched: (
    name: string,
    touched?: boolean,
  ) => void;

  setError: (
    name: string,
    error?: string,
  ) => void;

  validateField: (
    name: string,
  ) => Promise<
    string | undefined
  >;

  validate:
    () => Promise<boolean>;

  reset: () => void;

  submit:
    () => Promise<boolean>;
}

interface FormProviderProps {
  children: ReactNode;

  initialValues:
    FormValues;

  validators?:
    FormValidators;

  onSubmit: (
    values: FormValues,
  ) =>
    | void
    | Promise<void>;
}

const FormContext =
  createContext<
    FormContextValue | undefined
  >(undefined);

function normalizeError(
  error: unknown,
): string {
  if (
    error instanceof Error
  ) {
    return error.message;
  }

  return "Form submission failed.";
}

export function FormProvider({
  children,
  initialValues,
  validators = {},
  onSubmit,
}: FormProviderProps) {
  const [
    values,
    setValues,
  ] = useState<FormValues>(
    initialValues,
  );

  const [
    errors,
    setErrors,
  ] = useState<FormErrors>({});

  const [
    touched,
    setTouchedState,
  ] = useState<
    Record<string, boolean>
  >({});

  const [
    dirty,
    setDirty,
  ] = useState(false);

  const [
    pending,
    setPending,
  ] = useState(false);

  const [
    succeeded,
    setSucceeded,
  ] = useState(false);

  const [
    submitError,
    setSubmitError,
  ] = useState<
    string | null
  >(null);

  const setValue =
    useCallback(
      (
        name: string,
        value: unknown,
      ): void => {
        setValues(
          (current) => ({
            ...current,
            [name]: value,
          }),
        );

        setDirty(true);
        setSucceeded(false);
        setSubmitError(null);
      },
      [],
    );

  const setTouched =
    useCallback(
      (
        name: string,
        nextTouched = true,
      ): void => {
        setTouchedState(
          (current) => ({
            ...current,
            [name]:
              nextTouched,
          }),
        );
      },
      [],
    );

  const setError =
    useCallback(
      (
        name: string,
        error?: string,
      ): void => {
        setErrors(
          (current) => ({
            ...current,
            [name]: error,
          }),
        );
      },
      [],
    );

  const validateSingleField =
    useCallback(
      async (
        name: string,
      ): Promise<
        string | undefined
      > => {
        const error =
          await runFieldValidation(
            values[name],
            validators[name] ??
              [],
            values,
          );

        setError(
          name,
          error,
        );

        return error;
      },
      [
        setError,
        validators,
        values,
      ],
    );

  const validate =
    useCallback(
      async (): Promise<boolean> => {
        const nextErrors =
          await validateForm(
            values,
            validators,
          );

        setErrors(nextErrors);

        return !hasValidationErrors(
          nextErrors,
        );
      },
      [
        validators,
        values,
      ],
    );

  const reset =
    useCallback((): void => {
      setValues(
        initialValues,
      );

      setErrors({});
      setTouchedState({});
      setDirty(false);
      setPending(false);
      setSucceeded(false);
      setSubmitError(null);
    }, [initialValues]);

  const submit =
    useCallback(
      async (): Promise<boolean> => {
        const fieldNames =
          Object.keys(
            validators,
          );

        setTouchedState(
          Object.fromEntries(
            fieldNames.map(
              (name) => [
                name,
                true,
              ],
            ),
          ),
        );

        const valid =
          await validate();

        if (!valid) {
          return false;
        }

        setPending(true);
        setSucceeded(false);
        setSubmitError(null);

        try {
          await onSubmit(
            values,
          );

          setSucceeded(true);
          setDirty(false);

          return true;
        } catch (error: unknown) {
          setSubmitError(
            normalizeError(
              error,
            ),
          );

          return false;
        } finally {
          setPending(false);
        }
      },
      [
        onSubmit,
        validate,
        validators,
        values,
      ],
    );

  const contextValue =
    useMemo<FormContextValue>(
      () => ({
        values,
        errors,
        touched,
        dirty,
        pending,
        succeeded,
        submitError,
        setValue,
        setTouched,
        setError,
        validateField:
          validateSingleField,
        validate,
        reset,
        submit,
      }),
      [
        dirty,
        errors,
        pending,
        reset,
        setError,
        setTouched,
        setValue,
        submit,
        submitError,
        succeeded,
        touched,
        validate,
        validateSingleField,
        values,
      ],
    );

  return (
    <FormContext.Provider
      value={contextValue}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useForm():
  FormContextValue {
  const context =
    useContext(FormContext);

  if (!context) {
    throw new Error(
      "useForm must be used inside FormProvider.",
    );
  }

  return context;
}
