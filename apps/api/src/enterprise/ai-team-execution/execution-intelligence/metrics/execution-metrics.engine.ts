export interface ExecutionMetricInput {
  executionId: string;
  startedAt: Date;
  completedAt: Date;
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
}

export interface ExecutionMetrics {
  executionId: string;
  durationMs: number;
  successRate: number;
  failureRate: number;
  efficiencyScore: number;
}

export class ExecutionMetricsEngine {
  calculate(
    input: ExecutionMetricInput,
  ): ExecutionMetrics {
    const durationMs =
      input.completedAt.getTime() -
      input.startedAt.getTime();

    const total =
      Math.max(input.totalJobs, 1);

    const successRate =
      (input.completedJobs / total) * 100;

    const failureRate =
      (input.failedJobs / total) * 100;

    return {
      executionId: input.executionId,
      durationMs,
      successRate,
      failureRate,
      efficiencyScore:
        this.calculateEfficiency(
          successRate,
          durationMs,
        ),
    };
  }

  private calculateEfficiency(
    successRate: number,
    durationMs: number,
  ): number {
    const speedFactor =
      durationMs <= 1000
        ? 100
        : Math.max(
            0,
            100 -
              durationMs / 1000,
          );

    return Math.round(
      (successRate + speedFactor) / 2,
    );
  }
}
