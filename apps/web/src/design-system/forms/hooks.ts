import {
  useForm,
} from "./FormContext";

export function useFormField(
  name: string,
) {
  const form =
    useForm();

  return {
    value:
      form.values[name],

    error:
      form.touched[name]
        ? form.errors[name]
        : undefined,

    touched:
      Boolean(
        form.touched[name],
      ),

    disabled:
      form.pending,

    setValue: (
      value: unknown,
    ) =>
      form.setValue(
        name,
        value,
      ),

    setTouched: (
      touched = true,
    ) =>
      form.setTouched(
        name,
        touched,
      ),

    validate: () =>
      form.validateField(
        name,
      ),
  };
}
