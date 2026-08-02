import {
  describe,
  expect,
  it,
} from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";

import DashboardLazySection from "./DashboardLazySection";

describe(
  "DashboardLazySection",
  () => {
    it(
      "renders child content",
      () => {
        render(
          <DashboardLazySection
            label="analytics"
          >
            <div>
              Analytics content
            </div>
          </DashboardLazySection>,
        );

        expect(
          screen.getByText(
            "Analytics content",
          ),
        ).toBeInTheDocument();
      },
    );
  },
);
