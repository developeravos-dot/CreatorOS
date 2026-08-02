import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  EnterpriseDashboard,
} from "../../../enterprise-api";

import {
  buildDashboardChartSnapshot,
} from "./dashboard-kpi-intelligence-engine";

const dashboard:
  EnterpriseDashboard = {
  metrics: {
    projects: 5,
    activeProjects: 4,
    scripts: 10,
    scheduledContent: 6,
    prompts: 8,
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
  "dashboard KPI intelligence engine",
  () => {
    it(
      "builds chart snapshot",
      () => {
        const snapshot =
          buildDashboardChartSnapshot(
            dashboard,
            "30d",
          );

        expect(
          snapshot.period,
        ).toBe("30d");

        expect(
          snapshot.series,
        ).toHaveLength(4);

        expect(
          snapshot.insights,
        ).toHaveLength(4);
      },
    );

    it(
      "builds KPI deltas",
      () => {
        const snapshot =
          buildDashboardChartSnapshot(
            dashboard,
            "30d",
          );

        expect(
          snapshot.insights[0]
            ?.delta.label,
        ).toBeTruthy();
      },
    );

    it(
      "builds normalized sparklines",
      () => {
        const snapshot =
          buildDashboardChartSnapshot(
            dashboard,
            "7d",
          );

        expect(
          Math.max(
            ...(
              snapshot
                .insights[0]
                ?.sparkline ?? []
            ),
          ),
        ).toBeLessThanOrEqual(
          100,
        );
      },
    );

    it(
      "builds snapshot totals",
      () => {
        const snapshot =
          buildDashboardChartSnapshot(
            dashboard,
            "90d",
          );

        expect(
          snapshot.totals
            .production,
        ).toBeGreaterThan(0);

        expect(
          snapshot.totals
            .automation,
        ).toBeGreaterThan(0);
      },
    );
  },
);
