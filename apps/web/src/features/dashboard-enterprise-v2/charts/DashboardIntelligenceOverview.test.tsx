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

import DashboardIntelligenceOverview from "./DashboardIntelligenceOverview";

import type {
  DashboardChartSnapshot,
} from "../intelligence/dashboard-chart-types";

const populatedSnapshot:
  DashboardChartSnapshot = {
  generatedAt:
    "2026-08-02T12:00:00.000Z",

  period: "30d",

  series: [
    {
      id: "production",
      label:
        "Production output",
      description:
        "Production trend.",
      tone: "info",
      points: [
        {
          timestamp:
            "2026-08-01",
          label: "Aug 1",
          value: 10,
        },
        {
          timestamp:
            "2026-08-02",
          label: "Aug 2",
          value: 20,
        },
      ],
    },
  ],

  insights: [
    {
      id: "production",
      label:
        "Production output",
      value: 20,
      formattedValue: "20",
      tone: "info",
      description:
        "Production trend.",
      sparkline: [
        50,
        100,
      ],
      delta: {
        current: 20,
        previous: 10,
        absolute: 10,
        percentage: 100,
        direction: "up",
        label:
          "100% increase",
      },
    },
  ],

  totals: {
    production: 20,
    publishing: 0,
    automation: 0,
    engagement: 0,
  },
};

const emptySnapshot:
  DashboardChartSnapshot = {
  generatedAt:
    "2026-08-02T12:00:00.000Z",

  period: "30d",

  series: [
    {
      id: "production",
      label:
        "Production output",
      description:
        "Production trend.",
      tone: "info",
      points: [
        {
          timestamp:
            "2026-08-01",
          label: "Aug 1",
          value: 0,
        },
      ],
    },
  ],

  insights: [],

  totals: {
    production: 0,
    publishing: 0,
    automation: 0,
    engagement: 0,
  },
};

describe(
  "DashboardIntelligenceOverview",
  () => {
    it(
      "renders KPI and chart sections",
      () => {
        render(
          <DashboardIntelligenceOverview
            snapshot={
              populatedSnapshot
            }
            period="30d"
            onPeriodChange={
              vi.fn()
            }
          />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "KPI intelligence",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Performance trends",
            },
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "changes period",
      () => {
        const onPeriodChange =
          vi.fn();

        render(
          <DashboardIntelligenceOverview
            snapshot={
              populatedSnapshot
            }
            period="30d"
            onPeriodChange={
              onPeriodChange
            }
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name: "7 days",
            },
          ),
        );

        expect(
          onPeriodChange,
        ).toHaveBeenCalledWith(
          "7d",
        );
      },
    );

    it(
      "renders loading state",
      () => {
        render(
          <DashboardIntelligenceOverview
            snapshot={
              populatedSnapshot
            }
            period="30d"
            loading
            onPeriodChange={
              vi.fn()
            }
          />,
        );

        expect(
          screen.getByText(
            "Building KPI intelligence...",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders empty state",
      () => {
        render(
          <DashboardIntelligenceOverview
            snapshot={
              emptySnapshot
            }
            period="30d"
            onPeriodChange={
              vi.fn()
            }
          />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "No KPI chart data available",
            },
          ),
        ).toBeInTheDocument();
      },
    );
  },
);
