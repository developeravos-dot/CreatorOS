import {
  describe,
  expect,
  it,
} from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";

import DashboardPerformancePanel from "./DashboardPerformancePanel";

import {
  buildDashboardPerformanceSnapshot,
} from "./dashboard-performance-engine";

describe(
  "DashboardPerformancePanel",
  () => {
    it(
      "renders runtime metrics",
      () => {
        const snapshot =
          buildDashboardPerformanceSnapshot(
            [
              {
                id: "dashboard",
                durationMs: 50,
                timestamp:
                  "2026-08-02T12:00:00.000Z",
              },
            ],
            80,
            200,
          );

        render(
          <DashboardPerformancePanel
            snapshot={snapshot}
          />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Dashboard performance",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Average render",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Dashboard bundle",
          ),
        ).toBeInTheDocument();
      },
    );
  },
);
