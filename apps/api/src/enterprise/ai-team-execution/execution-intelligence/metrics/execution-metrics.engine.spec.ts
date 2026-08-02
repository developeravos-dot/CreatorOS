import {
  ExecutionMetricsEngine,
} from "./execution-metrics.engine";

describe(
  "ExecutionMetricsEngine",
  () => {
    it(
      "calculates execution metrics correctly",
      () => {
        const engine =
          new ExecutionMetricsEngine();

        const result =
          engine.calculate({
            executionId: "execution-1",
            startedAt:
              new Date(
                "2026-08-02T10:00:00Z",
              ),
            completedAt:
              new Date(
                "2026-08-02T10:00:05Z",
              ),
            totalJobs: 10,
            completedJobs: 9,
            failedJobs: 1,
          });

        expect(
          result.executionId,
        ).toBe(
          "execution-1",
        );

        expect(
          result.durationMs,
        ).toBe(
          5000,
        );

        expect(
          result.successRate,
        ).toBe(
          90,
        );

        expect(
          result.failureRate,
        ).toBe(
          10,
        );

        expect(
          result.efficiencyScore,
        ).toBeGreaterThan(
          0,
        );
      },
    );

    it(
      "handles zero jobs safely",
      () => {
        const engine =
          new ExecutionMetricsEngine();

        const result =
          engine.calculate({
            executionId: "execution-empty",
            startedAt:
              new Date(),
            completedAt:
              new Date(),
            totalJobs: 0,
            completedJobs: 0,
            failedJobs: 0,
          });

        expect(
          result.successRate,
        ).toBe(
          0,
        );

        expect(
          result.failureRate,
        ).toBe(
          0,
        );
      },
    );
  },
);
