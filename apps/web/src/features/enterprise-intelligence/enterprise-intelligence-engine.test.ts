import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createDashboardFixture,
} from "../../test/fixtures";

import {
  buildEnterpriseIntelligence,
} from "./enterprise-intelligence-engine";

describe(
  "buildEnterpriseIntelligence",
  () => {
    it(
      "calculates full system health",
      () => {
        const dashboard =
          createDashboardFixture();

        const intelligence =
          buildEnterpriseIntelligence(
            dashboard,
          );

        expect(
          intelligence.health.score,
        ).toBe(100);

        expect(
          intelligence.health.status,
        ).toBe("healthy");

        expect(
          intelligence.health.items.every(
            (item) =>
              item.healthy,
          ),
        ).toBe(true);
      },
    );

    it(
      "detects degraded system health",
      () => {
        const dashboard =
          createDashboardFixture({
            system: {
              projectEngine:
                "offline",
              scriptEngine:
                "operational",
              calendarEngine:
                "failed",
              promptEngine:
                "ready",
              storage:
                "persistent",
            },
          });

        const intelligence =
          buildEnterpriseIntelligence(
            dashboard,
          );

        expect(
          intelligence.health.score,
        ).toBe(60);

        expect(
          intelligence.health.status,
        ).toBe("attention");
      },
    );

    it(
      "calculates project activation rate",
      () => {
        const dashboard =
          createDashboardFixture({
            metrics: {
              projects: 4,
              activeProjects: 3,
              scripts: 8,
              scheduledContent: 4,
              prompts: 2,
            },
          });

        const intelligence =
          buildEnterpriseIntelligence(
            dashboard,
          );

        const activation =
          intelligence.kpis.find(
            (kpi) =>
              kpi.id ===
              "activation-rate",
          );

        expect(
          activation?.value,
        ).toBe(75);

        expect(
          activation?.severity,
        ).toBe("success");
      },
    );

    it(
      "builds unified activities",
      () => {
        const dashboard =
          createDashboardFixture({
            projects: [
              {
                id: "project-1",
                name: "Project One",
                description: "",
                platform:
                  "YouTube",
                status: "active",
                createdAt:
                  "2026-08-02T09:00:00.000Z",
                updatedAt:
                  "2026-08-02T10:00:00.000Z",
              },
            ],

            scripts: [
              {
                id: "script-1",
                projectId:
                  "project-1",
                title: "Script One",
                content: "Content",
                status: "draft",
                createdAt:
                  "2026-08-02T09:30:00.000Z",
                updatedAt:
                  "2026-08-02T10:30:00.000Z",
              },
            ],

            calendar: [
              {
                id: "calendar-1",
                projectId:
                  "project-1",
                title:
                  "Scheduled Content",
                platform:
                  "YouTube",
                scheduledAt:
                  "2026-08-02T12:00:00.000Z",
                status:
                  "scheduled",
                createdAt:
                  "2026-08-02T11:00:00.000Z",
              },
            ],
          });

        const intelligence =
          buildEnterpriseIntelligence(
            dashboard,
          );

        expect(
          intelligence.activities,
        ).toHaveLength(3);

        expect(
          intelligence.activities.map(
            (activity) =>
              activity.category,
          ),
        ).toEqual(
          expect.arrayContaining([
            "project",
            "script",
            "calendar",
          ]),
        );
      },
    );

    it(
      "creates operational forecasts",
      () => {
        const dashboard =
          createDashboardFixture({
            metrics: {
              projects: 4,
              activeProjects: 2,
              scripts: 10,
              scheduledContent: 6,
              prompts: 3,
            },
          });

        const intelligence =
          buildEnterpriseIntelligence(
            dashboard,
          );

        expect(
          intelligence.forecasts,
        ).toHaveLength(3);

        expect(
          intelligence.forecasts.every(
            (forecast) =>
              forecast.predictedValue >
              forecast.currentValue,
          ),
        ).toBe(true);
      },
    );

    it(
      "includes revenue intelligence",
      () => {
        const intelligence =
          buildEnterpriseIntelligence(
            createDashboardFixture(),
          );

        expect(
          intelligence.revenue,
        ).toBeDefined();

        expect(
          intelligence.revenue.opportunities,
        ).toHaveLength(6);
      },
    );
  },
);
