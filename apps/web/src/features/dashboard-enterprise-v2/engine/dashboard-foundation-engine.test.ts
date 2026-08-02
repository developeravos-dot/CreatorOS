import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  EnterpriseDashboard,
} from "../../../enterprise-api";

import {
  buildDashboardFoundation,
} from "./dashboard-foundation-engine";

const dashboard:
  EnterpriseDashboard = {
  metrics: {
    projects: 4,
    activeProjects: 3,
    scripts: 8,
    scheduledContent: 4,
    prompts: 6,
  },
  projects: [],
  scripts: [],
  calendar: [],
  prompts: [],
  system: {
    projectEngine: "operational",
    scriptEngine: "operational",
    calendarEngine: "operational",
    promptEngine: "operational",
    storage: "persistent",
  },
};

describe(
  "dashboard foundation engine",
  () => {
    it(
      "builds dashboard metrics",
      () => {
        const snapshot =
          buildDashboardFoundation({
            dashboard,
            connected: true,
          });

        expect(
          snapshot.metrics,
        ).toHaveLength(5);

        expect(
          snapshot.metrics.find(
            (metric) =>
              metric.id ===
              "active-projects",
          )?.progress,
        ).toBe(75);
      },
    );

    it(
      "builds operational statuses",
      () => {
        const snapshot =
          buildDashboardFoundation({
            dashboard,
            connected: true,
          });

        expect(
          snapshot.statuses.find(
            (status) =>
              status.id === "api",
          ),
        ).toMatchObject({
          value: "Connected",
          tone: "success",
        });
      },
    );

    it(
      "calculates production readiness",
      () => {
        const snapshot =
          buildDashboardFoundation({
            dashboard,
            connected: true,
          });

        expect(
          snapshot.summary
            .productionReadiness,
        ).toBeGreaterThan(0);

        expect(
          snapshot.summary
            .productionReadiness,
        ).toBeLessThanOrEqual(100);
      },
    );

    it(
      "handles disconnected state",
      () => {
        const snapshot =
          buildDashboardFoundation({
            dashboard,
            connected: false,
          });

        expect(
          snapshot.connected,
        ).toBe(false);

        expect(
          snapshot.statuses[0],
        ).toMatchObject({
          value:
            "Disconnected",
          tone: "danger",
        });
      },
    );
  },
);
