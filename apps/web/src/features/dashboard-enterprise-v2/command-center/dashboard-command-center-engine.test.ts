import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  EnterpriseDashboard,
} from "../../../enterprise-api";

import {
  buildDashboardCommandCenter,
} from "./dashboard-command-center-engine";

const dashboard:
  EnterpriseDashboard = {
  metrics: {
    projects: 1,
    activeProjects: 1,
    scripts: 1,
    scheduledContent: 0,
    prompts: 1,
  },

  projects: [
    {
      id: "project-1",
      name:
        "CreatorOS Channel",
      description:
        "Main production project.",
      platform: "YouTube",
      status: "active",
      createdAt:
        "2026-08-02T10:00:00.000Z",
      updatedAt:
        "2026-08-02T11:00:00.000Z",
    },
  ],

  scripts: [
    {
      id: "script-1",
      projectId:
        "project-1",
      title:
        "Launch Script",
      content:
        "Script content",
      status: "approved",
      createdAt:
        "2026-08-02T09:00:00.000Z",
      updatedAt:
        "2026-08-02T10:30:00.000Z",
    },
  ],

  calendar: [],

  prompts: [
    {
      id: "prompt-1",
      name:
        "Script Generator",
      purpose:
        "script creation",
      prompt:
        "Create a script",
      createdAt:
        "2026-08-02T08:00:00.000Z",
      updatedAt:
        "2026-08-02T08:30:00.000Z",
    },
  ],

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
  "dashboard command center engine",
  () => {
    it(
      "builds live activities",
      () => {
        const snapshot =
          buildDashboardCommandCenter({
            dashboard,
            connected: true,
            busy: false,
            now:
              new Date(
                "2026-08-02T12:00:00.000Z",
              ),
          });

        expect(
          snapshot.activities,
        ).toHaveLength(3);

        expect(
          snapshot.activities[0]
            ?.relativeTime,
        ).toBe("1h ago");
      },
    );

    it(
      "builds quick commands",
      () => {
        const snapshot =
          buildDashboardCommandCenter({
            dashboard,
            connected: true,
            busy: false,
          });

        expect(
          snapshot.commands,
        ).toHaveLength(4);

        expect(
          snapshot.summary
            .availableCommands,
        ).toBe(4);
      },
    );

    it(
      "builds publishing alert",
      () => {
        const snapshot =
          buildDashboardCommandCenter({
            dashboard,
            connected: true,
            busy: false,
          });

        expect(
          snapshot.alerts.some(
            (alert) =>
              alert.id ===
              "no-scheduled-content",
          ),
        ).toBe(true);
      },
    );

    it(
      "disables commands while busy",
      () => {
        const snapshot =
          buildDashboardCommandCenter({
            dashboard,
            connected: true,
            busy: true,
          });

        expect(
          snapshot.summary
            .availableCommands,
        ).toBe(0);
      },
    );
  },
);
