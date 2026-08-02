import {
  describe,
  expect,
  it,
} from "vitest";

import {
  buildDashboardPerformanceSnapshot,
} from "./dashboard-performance-engine";

describe(
  "dashboard performance engine",
  () => {
    it(
      "builds healthy performance metrics",
      () => {
        const snapshot =
          buildDashboardPerformanceSnapshot(
            [
              {
                id: "dashboard",
                durationMs: 40,
                timestamp:
                  "2026-08-02T12:00:00.000Z",
              },
              {
                id: "dashboard",
                durationMs: 60,
                timestamp:
                  "2026-08-02T12:01:00.000Z",
              },
            ],
            60,
            180,
            new Date(
              "2026-08-02T12:02:00.000Z",
            ),
          );

        expect(
          snapshot.metrics.find(
            (metric) =>
              metric.id ===
              "average-render",
          )?.value,
        ).toBe(50);

        expect(
          snapshot.summary
            .critical,
        ).toBe(0);

        expect(
          snapshot.summary.score,
        ).toBe(100);
      },
    );

    it(
      "detects critical metrics",
      () => {
        const snapshot =
          buildDashboardPerformanceSnapshot(
            [
              {
                id: "dashboard",
                durationMs: 500,
                timestamp:
                  "2026-08-02T12:00:00.000Z",
              },
            ],
            300,
            700,
          );

        expect(
          snapshot.summary
            .critical,
        ).toBeGreaterThan(0);

        expect(
          snapshot.summary.score,
        ).toBeLessThan(100);
      },
    );

    it(
      "supports empty measurements",
      () => {
        const snapshot =
          buildDashboardPerformanceSnapshot(
            [],
            0,
            0,
          );

        expect(
          snapshot.metrics.find(
            (metric) =>
              metric.id ===
              "average-render",
          )?.value,
        ).toBe(0);
      },
    );
  },
);
