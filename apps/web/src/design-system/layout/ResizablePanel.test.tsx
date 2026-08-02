import {
  describe,
  expect,
  it,
} from "vitest";

import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import ResizablePanel from "./ResizablePanel";

describe(
  "ResizablePanel",
  () => {
    it(
      "renders both panels",
      () => {
        render(
          <ResizablePanel
            storageKey="test.panel"
            primary={
              <span>
                Primary
              </span>
            }
            secondary={
              <span>
                Secondary
              </span>
            }
          />,
        );

        expect(
          screen.getByText(
            "Primary",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Secondary",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "collapses and expands primary panel",
      () => {
        render(
          <ResizablePanel
            storageKey="test.panel"
            primary={
              <span>
                Primary
              </span>
            }
            secondary={
              <span>
                Secondary
              </span>
            }
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Collapse primary panel",
            },
          ),
        );

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "Expand primary panel",
            },
          ),
        ).toBeInTheDocument();

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Expand primary panel",
            },
          ),
        );

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "Collapse primary panel",
            },
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "changes size with keyboard",
      () => {
        render(
          <ResizablePanel
            storageKey="test.keyboard.panel"
            initialSize={300}
            primary={
              <span>
                Primary
              </span>
            }
            secondary={
              <span>
                Secondary
              </span>
            }
          />,
        );

        const separator =
          screen.getByRole(
            "separator",
          );

        fireEvent.keyDown(
          separator,
          {
            key:
              "ArrowRight",
          },
        );

        expect(
          localStorage.getItem(
            "test.keyboard.panel",
          ),
        ).toBe("320");
      },
    );

    it(
      "loads stored size",
      () => {
        localStorage.setItem(
          "test.stored.panel",
          "420",
        );

        const {
          container,
        } = render(
          <ResizablePanel
            storageKey="test.stored.panel"
            initialSize={300}
            primary={
              <span>
                Primary
              </span>
            }
            secondary={
              <span>
                Secondary
              </span>
            }
          />,
        );

        const primary =
          container.querySelector(
            ".cos-resizable-panel__primary",
          );

        expect(primary).toHaveStyle({
          width: "420px",
        });
      },
    );
  },
);
