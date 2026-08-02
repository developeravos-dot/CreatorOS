import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createDashboardFixture,
} from "../../test/fixtures";

import {
  buildRevenueIntelligence,
} from "./enterprise-revenue-engine";

describe(
  "buildRevenueIntelligence",
  () => {
    it(
      "returns bounded readiness scores",
      () => {
        const revenue =
          buildRevenueIntelligence(
            createDashboardFixture(),
          );

        expect(
          revenue.readinessScore,
        ).toBeGreaterThanOrEqual(
          0,
        );

        expect(
          revenue.readinessScore,
        ).toBeLessThanOrEqual(
          100,
        );

        expect(
          revenue.monetizationScore,
        ).toBeGreaterThanOrEqual(
          0,
        );

        expect(
          revenue.monetizationScore,
        ).toBeLessThanOrEqual(
          100,
        );
      },
    );

    it(
      "ranks opportunities by score",
      () => {
        const revenue =
          buildRevenueIntelligence(
            createDashboardFixture({
              projects: [
                {
                  id: "p1",
                  name: "Channel One",
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
                  id: "s1",
                  projectId: "p1",
                  title: "Script",
                  content: "Body",
                  status: "approved",
                  createdAt:
                    "2026-08-02T09:30:00.000Z",
                  updatedAt:
                    "2026-08-02T10:30:00.000Z",
                },
              ],

              calendar: [
                {
                  id: "c1",
                  projectId: "p1",
                  title:
                    "Scheduled",
                  platform:
                    "YouTube",
                  status:
                    "scheduled",
                  scheduledAt:
                    "2026-08-03T12:00:00.000Z",
                  createdAt:
                    "2026-08-02T11:00:00.000Z",
                },
              ],

              prompts: [
                {
                  id: "prompt-1",
                  name: "Prompt",
                  purpose:
                    "Writing",
                  prompt:
                    "Create content",
                  createdAt:
                    "2026-08-02T08:00:00.000Z",
                  updatedAt:
                    "2026-08-02T08:30:00.000Z",
                },
              ],
            }),
          );

        const scores =
          revenue.opportunities.map(
            (opportunity) =>
              opportunity.score,
          );

        expect(scores).toEqual(
          [...scores].sort(
            (left, right) =>
              right - left,
          ),
        );
      },
    );

    it(
      "produces positive pipeline estimates",
      () => {
        const revenue =
          buildRevenueIntelligence(
            createDashboardFixture({
              metrics: {
                projects: 2,
                activeProjects: 1,
                scripts: 4,
                scheduledContent: 2,
                prompts: 2,
              },
            }),
          );

        expect(
          revenue.estimatedPipelineValue,
        ).toBeGreaterThan(0);

        expect(
          revenue.estimatedMonthlyPotential,
        ).toBeGreaterThan(0);
      },
    );

    it(
      "keeps all revenue figures explicitly heuristic",
      () => {
        const revenue =
          buildRevenueIntelligence(
            createDashboardFixture(),
          );

        expect(
          revenue.opportunities.every(
            (opportunity) =>
              opportunity.confidence >=
                0 &&
              opportunity.confidence <=
                100,
          ),
        ).toBe(true);
      },
    );
  },
);
