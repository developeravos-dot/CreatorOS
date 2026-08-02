import {
  describe,
  expect,
  it,
} from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";

import DashboardFoundationOverview from "./DashboardFoundationOverview";
import DashboardMetricGrid from "./DashboardMetricGrid";
import DashboardOperationalStatusGrid from "./DashboardOperationalStatusGrid";
import DashboardReadinessPanel from "./DashboardReadinessPanel";

import type {
  DashboardFoundationSnapshot,
} from "../dashboard-foundation-types";

const snapshot:
  DashboardFoundationSnapshot = {
  generatedAt:
    "2026-08-02T12:00:00.000Z",

  connected: true,

  metrics: [
    {
      id: "projects",
      label:
        "Total projects",
      value: 4,
      formattedValue: "4",
      description:
        "Project total.",
      tone: "info",
      progress: 75,
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
    totalEntities: 22,
    productionReadiness: 76,
    activeRatio: 75,
    schedulingRatio: 50,
    automationRatio: 80,
  },
};

describe(
  "dashboard foundation components",
  () => {
    it(
      "renders metric grid",
      () => {
        render(
          <DashboardMetricGrid
            metrics={
              snapshot.metrics
            }
          />,
        );

        expect(
          screen.getByText(
            "Total projects",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText("4"),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders readiness values",
      () => {
        render(
          <DashboardReadinessPanel
            summary={
              snapshot.summary
            }
          />,
        );

        expect(
          screen.getByText(
            "76%",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "22 entities",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders operational statuses",
      () => {
        render(
          <DashboardOperationalStatusGrid
            statuses={
              snapshot.statuses
            }
          />,
        );

        expect(
          screen.getByText(
            "Enterprise API",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Connected",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders complete overview",
      () => {
        render(
          <DashboardFoundationOverview
            snapshot={
              snapshot
            }
          />,
        );

        expect(
          screen.getByText(
            "Enterprise metrics",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Production readiness",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Operational status",
          ),
        ).toBeInTheDocument();
      },
    );
  },
);
