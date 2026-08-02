import {
  IntelligenceReportAggregator,
} from "./intelligence-report.aggregator";

describe(
  "IntelligenceReportAggregator",
  () => {
    it(
      "generates complete intelligence report",
      () => {
        const aggregator =
          new IntelligenceReportAggregator();

        const report =
          aggregator.generate({
            execution: {
              executionId: "execution-1",
              totalJobs: 5,
              completedJobs: 5,
              failedJobs: 0,
              durationMs: 2000,
            },

            metrics: {
              executionId: "execution-1",
              startedAt:
                new Date(
                  "2026-08-02T10:00:00Z",
                ),
              completedAt:
                new Date(
                  "2026-08-02T10:00:02Z",
                ),
              totalJobs: 5,
              completedJobs: 5,
              failedJobs: 0,
            },

            failures: [],
          });

        expect(
          report.executionId,
        ).toBe(
          "execution-1",
        );

        expect(
          report.analysis,
        ).toBeDefined();

        expect(
          report.metrics,
        ).toBeDefined();

        expect(
          report.failures,
        ).toHaveLength(
          0,
        );

        expect(
          report.generatedAt,
        ).toBeInstanceOf(
          Date,
        );
      },
    );


    it(
      "includes failure intelligence",
      () => {
        const aggregator =
          new IntelligenceReportAggregator();

        const report =
          aggregator.generate({
            execution: {
              executionId: "execution-failed",
              totalJobs: 3,
              completedJobs: 1,
              failedJobs: 2,
              durationMs: 5000,
            },

            metrics: {
              executionId: "execution-failed",
              startedAt:
                new Date(
                  "2026-08-02T10:00:00Z",
                ),
              completedAt:
                new Date(
                  "2026-08-02T10:00:05Z",
                ),
              totalJobs: 3,
              completedJobs: 1,
              failedJobs: 2,
            },

            failures: [
              {
                executionId:
                  "execution-failed",
                stepId:
                  "step-1",
                errorMessage:
                  "Runtime exception occurred",
              },
            ],
          });

        expect(
          report.failures,
        ).toHaveLength(
          1,
        );
      },
    );
  },
);
