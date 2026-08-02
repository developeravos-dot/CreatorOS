import {
  describe,
  expect,
  it,
} from "vitest";

import {
  compose,
  email,
  hasValidationErrors,
  maxLength,
  minLength,
  regex,
  required,
  url,
  validateField,
  validateForm,
} from "./Validation";

describe(
  "form validation",
  () => {
    it(
      "validates required values",
      async () => {
        expect(
          await required()(
            "",
            {},
          ),
        ).toBe(
          "This field is required.",
        );
      },
    );

    it(
      "validates minimum length",
      async () => {
        expect(
          await minLength(3)(
            "ab",
            {},
          ),
        ).toBe(
          "Minimum length is 3.",
        );
      },
    );

    it(
      "validates maximum length",
      async () => {
        expect(
          await maxLength(3)(
            "abcd",
            {},
          ),
        ).toBe(
          "Maximum length is 3.",
        );
      },
    );

    it(
      "validates email addresses",
      async () => {
        expect(
          await email()(
            "invalid",
            {},
          ),
        ).toBeDefined();

        expect(
          await email()(
            "user@example.com",
            {},
          ),
        ).toBeUndefined();
      },
    );

    it(
      "validates URLs",
      async () => {
        expect(
          await url()(
            "not-a-url",
            {},
          ),
        ).toBeDefined();

        expect(
          await url()(
            "https://example.com",
            {},
          ),
        ).toBeUndefined();
      },
    );

    it(
      "validates regular expressions",
      async () => {
        expect(
          await regex(
            /^COS-/,
          )(
            "ABC-1",
            {},
          ),
        ).toBeDefined();
      },
    );

    it(
      "composes validators",
      async () => {
        const validator =
          compose(
            required(),
            minLength(4),
          );

        expect(
          await validator(
            "abc",
            {},
          ),
        ).toBe(
          "Minimum length is 4.",
        );
      },
    );

    it(
      "validates fields and forms",
      async () => {
        expect(
          await validateField(
            "",
            [required()],
          ),
        ).toBeDefined();

        const errors =
          await validateForm(
            {
              name: "",
            },
            {
              name: [
                required(),
              ],
            },
          );

        expect(
          hasValidationErrors(
            errors,
          ),
        ).toBe(true);
      },
    );
  },
);
