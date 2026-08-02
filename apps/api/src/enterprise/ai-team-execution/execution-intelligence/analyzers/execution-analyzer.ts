import {
  ExecutionAnalysis,
  ExecutionHealthStatus,
  ExecutionPerformanceScore,
  ExecutionFailureInsight,
} from "../models/execution-intelligence.types";

export interface ExecutionAnalyzerInput {
  executionId: string;
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  durationMs: number;
  failures?: ExecutionFailureInsight[];
}

export class ExecutionAnalyzer {
  analyze(
    input: ExecutionAnalyzerInput,
  ): ExecutionAnalysis {
    const total =
      Math.max(input.totalJobs, 1);

    const successRate =
      (input.completedJobs / total) * 100;

    const failureRate =
      (input.failedJobs / total) * 100;

    const performance: ExecutionPerformanceScore = {
      executionId: input.executionId,
      successRate,
      failureRate,
      averageDurationMs: input.durationMs,
      score: this.calculateScore(
        successRate,
        failureRate,
      ),
    };

    return {
      executionId: input.executionId,
      status: this.calculateHealth(
        performance,
      ),
      performance,
      failures: input.failures ?? [],
      generatedAt: new Date(),
    };
  }

  private calculateScore(
    successRate: number,
    failureRate: number,
  ): number {
    return Math.max(
      0,
      Math.min(
        100,
        successRate - failureRate,
      ),
    );
  }

  private calculateHealth(
    performance: ExecutionPerformanceScore,
  ): ExecutionHealthStatus {
    if (performance.score >= 80) {
      return ExecutionHealthStatus.HEALTHY;
    }

    if (performance.score >= 50) {
      return ExecutionHealthStatus.WARNING;
    }

    return ExecutionHealthStatus.CRITICAL;
  }
}
