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

import DashboardFoundationShell from "./DashboardFoundationShell";

import type {
  DashboardFoundationSnapshot,
} from "../dashboard-foundation-types";

const populatedSnapshot:
  DashboardFoundationSnapshot = {
  generatedAt:
    "2026-08-02T12:00:00.000Z",

  connected: true,

  metrics: [
    {
      id: "projects",
      label:
        "Total projects",
      value: 2,
      formattedValue: "2",
      description:
        "Project total.",
      tone: "info",
      progress: 100,
    },
  ],

  statuses: [
    {
      id: "api",
      label:
        "Enterprise API",
      value: "Connected",
      tone: "success",
      description:
        "API is connected.",
    },
  ],

  summary: {
    totalEntities: 2,
    productionReadiness: 75,
    activeRatio: 100,
    schedulingRatio: 0,
    automationRatio: 100,
  },
};

const emptySnapshot:
  DashboardFoundationSnapshot = {
  ...populatedSnapshot,

  metrics: [],

  statuses: [],

  summary: {
    totalEntities: 0,
    productionReadiness: 25,
    activeRatio: 0,
    schedulingRatio: 0,
    automationRatio: 0,
  },
};

describe(
  "DashboardFoundationShell",
  () => {
    it(
      "renders the foundation overview",
      () => {
        render(
          <DashboardFoundationShell
            snapshot={
              populatedSnapshot
            }
          />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Dashboard 2.0",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Enterprise metrics",
            },
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders loading state",
      () => {
        render(
          <DashboardFoundationShell
            snapshot={
              populatedSnapshot
            }
            loading
          />,
        );

        expect(
          screen.getByText(
            "Loading Dashboard 2.0...",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders error state and retries",
      () => {
        const onRefresh =
          vi.fn();

        render(
          <DashboardFoundationShell
            snapshot={
              populatedSnapshot
            }
            error="Unable to load data."
            onRefresh={
              onRefresh
            }
          />,
        );

        expect(
          screen.getByText(
            "Unable to load data.",
          ),
        ).toBeInTheDocument();

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name: "Retry",
            },
          ),
        );

        expect(
          onRefresh,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );

    it(
      "renders empty state",
      () => {
        render(
          <DashboardFoundationShell
            snapshot={
              emptySnapshot
            }
          />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Dashboard has no enterprise data",
            },
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "refreshes from the header",
      () => {
        const onRefresh =
          vi.fn();

        render(
          <DashboardFoundationShell
            snapshot={
              populatedSnapshot
            }
            onRefresh={
              onRefresh
            }
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Refresh dashboard",
            },
          ),
        );

        expect(
          onRefresh,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );
  },
);
