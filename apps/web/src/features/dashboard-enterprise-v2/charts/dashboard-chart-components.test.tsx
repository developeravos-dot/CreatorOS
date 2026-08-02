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

import DashboardChartPanel from "./DashboardChartPanel";
import DashboardKpiInsightGrid from "./DashboardKpiInsightGrid";
import DashboardLineChart from "./DashboardLineChart";
import DashboardPeriodSelector from "./DashboardPeriodSelector";

import type {
  DashboardKpiInsight,
  DashboardTimeSeries,
} from "../intelligence/dashboard-chart-types";

const series:
  DashboardTimeSeries = {
  id: "production",
  label: "Production output",
  description: "Production trend.",
  tone: "info",
  points: [
    {
      timestamp: "2026-08-01",
      label: "Aug 1",
      value: 10,
    },
    {
      timestamp: "2026-08-02",
      label: "Aug 2",
      value: 20,
    },
  ],
};

const insight:
  DashboardKpiInsight = {
  id: "production",
  label: "Production output",
  value: 20,
  formattedValue: "20",
  tone: "info",
  description: "Production trend.",
  sparkline: [50, 100],
  delta: {
    current: 20,
    previous: 10,
    absolute: 10,
    percentage: 100,
    direction: "up",
    label: "100% increase",
  },
};

describe(
  "dashboard chart components",
  () => {
    it(
      "renders line chart",
      () => {
        render(
          <DashboardLineChart
            series={series}
          />,
        );

        expect(
          screen.getByRole(
            "img",
            {
              name:
                "Production output chart",
            },
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "shows a focused point tooltip",
      () => {
        render(
          <DashboardLineChart
            series={series}
          />,
        );

        fireEvent.focus(
          screen.getByLabelText(
            "Aug 2: 20",
          ),
        );

        expect(
          screen.getByRole(
            "status",
          ),
        ).toHaveTextContent(
          "20",
        );
      },
    );

    it(
      "changes dashboard period",
      () => {
        const onChange =
          vi.fn();

        render(
          <DashboardPeriodSelector
            value="30d"
            onChange={
              onChange
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
          onChange,
        ).toHaveBeenCalledWith(
          "7d",
        );
      },
    );

    it(
      "renders KPI insight grid",
      () => {
        render(
          <DashboardKpiInsightGrid
            insights={[
              insight,
            ]}
          />,
        );

        expect(
          screen.getByText(
            /100% increase/,
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "switches chart series",
      () => {
        render(
          <DashboardChartPanel
            series={[
              series,
              {
                ...series,
                id: "publishing",
                label:
                  "Publishing pipeline",
              },
            ]}
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Publishing pipeline",
            },
          ),
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Publishing pipeline",
            },
          ),
        ).toBeInTheDocument();
      },
    );
  },
);
