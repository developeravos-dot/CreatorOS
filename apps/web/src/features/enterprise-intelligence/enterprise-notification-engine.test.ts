import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  EnterpriseIntelligenceSnapshot,
} from "./enterprise-intelligence-types";

import {
  buildIntelligenceNotifications,
  summarizeNotifications,
} from "./enterprise-notification-engine";

function createSnapshot():
  EnterpriseIntelligenceSnapshot {
  return {
    generatedAt:
      "2026-08-02T12:00:00.000Z",

    kpis: [],

    activities: [
      {
        id: "activity-1",
        category: "project",
        title: "Project",
        description:
          "Project active",
        timestamp:
          "2026-08-02T11:00:00.000Z",
        severity: "success",
      },

      {
        id: "activity-2",
        category: "script",
        title: "Script",
        description:
          "Script blocked",
        timestamp:
          "2026-08-02T10:00:00.000Z",
        severity: "critical",
      },
    ],

    health: {
      score: 50,
      status: "attention",
      items: [
        {
          id: "api",
          label: "API",
          status: "offline",
          healthy: false,
          score: 25,
        },
      ],
    },

    forecasts: [],

    revenue: {
      readinessScore: 0,
      monetizationScore: 0,
      sponsorshipReadiness: 0,
      contentAssetLeverage: 0,
      estimatedPipelineValue: 0,
      estimatedMonthlyPotential: 0,
      opportunities: [],
    },

    distribution: {
      projects: 0,
      activeProjects: 0,
      scripts: 0,
      scheduledContent: 0,
      prompts: 0,
    },
  };
}

describe(
  "enterprise notification engine",
  () => {
    it(
      "creates notifications from activity and health",
      () => {
        const notifications =
          buildIntelligenceNotifications(
            createSnapshot(),
          );

        expect(
          notifications,
        ).toHaveLength(3);

        expect(
          notifications.some(
            (notification) =>
              notification.category ===
              "system",
          ),
        ).toBe(true);
      },
    );

    it(
      "summarizes notification severity",
      () => {
        const notifications =
          buildIntelligenceNotifications(
            createSnapshot(),
          );

        const summary =
          summarizeNotifications(
            notifications,
          );

        expect(summary.total).toBe(3);
        expect(summary.unread).toBe(3);
        expect(summary.critical).toBe(1);
        expect(summary.warning).toBe(1);
        expect(summary.success).toBe(1);
      },
    );

    it(
      "respects read state",
      () => {
        const notifications =
          buildIntelligenceNotifications(
            createSnapshot(),
          ).map(
            (
              notification,
              index,
            ) => ({
              ...notification,
              read: index === 0,
            }),
          );

        const summary =
          summarizeNotifications(
            notifications,
          );

        expect(summary.unread).toBe(2);
      },
    );
  },
);
