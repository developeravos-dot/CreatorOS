import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import Form from "./Form";
import {
  FormProvider,
  useForm,
} from "./FormContext";
import TextInput from "./TextInput";
import TextArea from "./TextArea";
import Select from "./Select";
import Checkbox from "./Checkbox";
import Switch from "./Switch";

import {
  required,
} from "./Validation";

function FormStatus() {
  const {
    dirty,
    pending,
    succeeded,
    reset,
  } = useForm();

  return (
    <div>
      <span>
        {dirty
          ? "dirty"
          : "clean"}
      </span>

      <span>
        {pending
          ? "pending"
          : "idle"}
      </span>

      <span>
        {succeeded
          ? "succeeded"
          : "not-succeeded"}
      </span>

      <button
        type="button"
        onClick={reset}
      >
        Reset
      </button>
    </div>
  );
}

function TestForm({
  onSubmit,
}: {
  onSubmit: (
    values:
      Record<string, unknown>,
  ) => Promise<void> | void;
}) {
  return (
    <FormProvider
      initialValues={{
        name: "",
        description: "",
        status: "draft",
        enabled: false,
        featured: false,
      }}
      validators={{
        name: [
          required(
            "Name is required.",
          ),
        ],
      }}
      onSubmit={onSubmit}
    >
      <Form>
        <TextInput
          name="name"
          label="Name"
          required
        />

        <TextArea
          name="description"
          label="Description"
        />

        <Select
          name="status"
          label="Status"
          options={[
            {
              value: "draft",
              label: "Draft",
            },
            {
              value: "active",
              label: "Active",
            },
          ]}
        />

        <Checkbox
          name="featured"
          label="Featured"
        />

        <Switch
          name="enabled"
          label="Enabled"
        />

        <FormStatus />

        <button type="submit">
          Save
        </button>
      </Form>
    </FormProvider>
  );
}

describe(
  "advanced form system",
  () => {
    it(
      "updates controlled fields",
      () => {
        render(
          <TestForm
            onSubmit={
              vi.fn()
            }
          />,
        );

        fireEvent.change(
          screen.getByLabelText(
            /Name/,
          ),
          {
            target: {
              value:
                "CreatorOS",
            },
          },
        );

        expect(
          screen.getByLabelText(
            /Name/,
          ),
        ).toHaveValue(
          "CreatorOS",
        );

        expect(
          screen.getByText(
            "dirty",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "shows validation errors",
      async () => {
        render(
          <TestForm
            onSubmit={
              vi.fn()
            }
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name: "Save",
            },
          ),
        );

        expect(
          await screen.findByText(
            "Name is required.",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "submits valid values",
      async () => {
        const onSubmit =
          vi.fn();

        render(
          <TestForm
            onSubmit={
              onSubmit
            }
          />,
        );

        fireEvent.change(
          screen.getByLabelText(
            /Name/,
          ),
          {
            target: {
              value:
                "CreatorOS",
            },
          },
        );

        fireEvent.click(
          screen.getByRole(
            "checkbox",
            {
              name: "Featured",
            },
          ),
        );

        fireEvent.click(
          screen.getByRole(
            "switch",
          ),
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name: "Save",
            },
          ),
        );

        await waitFor(() => {
          expect(
            onSubmit,
          ).toHaveBeenCalledWith(
            expect.objectContaining({
              name:
                "CreatorOS",
              featured: true,
              enabled: true,
            }),
          );
        });

        expect(
          screen.getByText(
            "succeeded",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "resets values and state",
      () => {
        render(
          <TestForm
            onSubmit={
              vi.fn()
            }
          />,
        );

        fireEvent.change(
          screen.getByLabelText(
            /Name/,
          ),
          {
            target: {
              value: "Changed",
            },
          },
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name: "Reset",
            },
          ),
        );

        expect(
          screen.getByLabelText(
            /Name/,
          ),
        ).toHaveValue("");

        expect(
          screen.getByText(
            "clean",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "shows submission failures",
      async () => {
        render(
          <TestForm
            onSubmit={
              async () => {
                throw new Error(
                  "Save failed.",
                );
              }
            }
          />,
        );

        fireEvent.change(
          screen.getByLabelText(
            /Name/,
          ),
          {
            target: {
              value: "Valid",
            },
          },
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name: "Save",
            },
          ),
        );

        expect(
          await screen.findByText(
            "Save failed.",
          ),
        ).toBeInTheDocument();
      },
    );
  },
);
