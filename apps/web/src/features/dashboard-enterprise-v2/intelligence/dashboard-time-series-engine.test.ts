import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  EnterpriseDashboard,
} from "../../../enterprise-api";

import {
  buildDashboardTimeSeries,
} from "./dashboard-time-series-engine";

const dashboard:
  EnterpriseDashboard = {
  metrics: {
    projects: 4,
    activeProjects: 3,
    scripts: 8,
    scheduledContent: 5,
    prompts: 6,
  },
  projects: [],
  scripts: [],
  calendar: [],
  prompts: [],
  system: {
    projectEngine:
      "operational",
    scriptEngine:
      "operational",
    calendarEngine:
      "operational",
    promptEngine:
      "operational",
    storage:
      "persistent",
  },
};

describe(
  "dashboard time series engine",
  () => {
    it(
      "builds four chart series",
      () => {
        const series =
          buildDashboardTimeSeries(
            dashboard,
            "30d",
          );

        expect(
          series,
        ).toHaveLength(4);
      },
    );

    it(
      "builds the expected 30 day points",
      () => {
        const series =
          buildDashboardTimeSeries(
            dashboard,
            "30d",
          );

        expect(
          series[0]?.points,
        ).toHaveLength(15);
      },
    );

    it(
      "builds yearly points",
      () => {
        const series =
          buildDashboardTimeSeries(
            dashboard,
            "1y",
          );

        expect(
          series[0]?.points,
        ).toHaveLength(12);
      },
    );

    it(
      "uses dashboard metrics",
      () => {
        const series =
          buildDashboardTimeSeries(
            dashboard,
            "7d",
          );

        expect(
          series.find(
            (item) =>
              item.id ===
              "production",
          )?.points.at(-1)
            ?.value,
        ).toBeGreaterThan(0);
      },
    );
  },
);
