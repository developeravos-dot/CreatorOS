import {
  describe,
  expect,
  it,
} from "vitest";

describe(
  "CreatorOS web test foundation",
  () => {
    it(
      "provides a jsdom environment",
      () => {
        const element =
          document.createElement(
            "div",
          );

        element.textContent =
          "CreatorOS";

        document.body.appendChild(
          element,
        );

        expect(
          document.body,
        ).toHaveTextContent(
          "CreatorOS",
        );
      },
    );
  },
);
