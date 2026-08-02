import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  EnterpriseDashboard,
} from "../../../enterprise-api";

import {
  buildDashboardAlerts,
} from "./dashboard-alert-intelligence-engine";

const emptyDashboard:
  EnterpriseDashboard = {
  metrics: {
    projects: 0,
    activeProjects: 0,
    scripts: 0,
    scheduledContent: 0,
    prompts: 0,
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
  "dashboard alert intelligence",
  () => {
    it(
      "creates connectivity alert",
      () => {
        const alerts =
          buildDashboardAlerts(
            emptyDashboard,
            false,
          );

        expect(
          alerts.find(
            (alert) =>
              alert.id ===
              "api-disconnected",
          ),
        ).toMatchObject({
          severity:
            "critical",
        });
      },
    );

    it(
      "creates empty pipeline alerts",
      () => {
        const alerts =
          buildDashboardAlerts(
            emptyDashboard,
            true,
          );

        expect(
          alerts.some(
            (alert) =>
              alert.id ===
              "no-projects",
          ),
        ).toBe(true);

        expect(
          alerts.some(
            (alert) =>
              alert.id ===
              "no-prompts",
          ),
        ).toBe(true);
      },
    );
  },
);
