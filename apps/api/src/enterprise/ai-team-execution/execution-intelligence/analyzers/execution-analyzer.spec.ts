import {
  ExecutionAnalyzer,
} from "./execution-analyzer";

describe(
  "ExecutionAnalyzer",
  () => {
    it(
      "returns healthy execution analysis",
      () => {
        const analyzer =
          new ExecutionAnalyzer();

        const result =
          analyzer.analyze({
            executionId: "execution-1",
            totalJobs: 10,
            completedJobs: 10,
            failedJobs: 0,
            durationMs: 1000,
          });

        expect(
          result.executionId,
        ).toBe(
          "execution-1",
        );

        expect(
          result.performance.successRate,
        ).toBe(
          100,
        );

        expect(
          result.status,
        ).toBe(
          "HEALTHY",
        );
      },
    );

    it(
      "returns critical status on failures",
      () => {
        const analyzer =
          new ExecutionAnalyzer();

        const result =
          analyzer.analyze({
            executionId: "execution-2",
            totalJobs: 10,
            completedJobs: 2,
            failedJobs: 8,
            durationMs: 5000,
          });

        expect(
          result.status,
        ).toBe(
          "CRITICAL",
        );

        expect(
          result.performance.failureRate,
        ).toBe(
          80,
        );
      },
    );
  },
);
