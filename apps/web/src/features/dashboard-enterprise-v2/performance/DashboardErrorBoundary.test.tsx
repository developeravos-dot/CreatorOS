import type {
  ReactNode,
} from "react";

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
} from "@testing-library/react";

import DashboardErrorBoundary from "./DashboardErrorBoundary";

function BrokenComponent(): ReactNode {
  throw new Error(
    "Dashboard failure",
  );
}

describe(
  "DashboardErrorBoundary",
  () => {
    it(
      "renders safe recovery UI",
      () => {
        const consoleError =
          vi.spyOn(
            console,
            "error",
          )
            .mockImplementation(
              () => undefined,
            );

        render(
          <DashboardErrorBoundary>
            <BrokenComponent />
          </DashboardErrorBoundary>,
        );

        expect(
          screen.getByRole(
            "alert",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Dashboard 2.0 encountered an error",
            },
          ),
        ).toBeInTheDocument();

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Retry dashboard",
            },
          ),
        );

        consoleError.mockRestore();
      },
    );
  },
);
