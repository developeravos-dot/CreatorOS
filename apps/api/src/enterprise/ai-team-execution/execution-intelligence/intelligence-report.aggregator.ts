import {
  ExecutionAnalyzer,
  ExecutionAnalyzerInput,
} from "./analyzers/execution-analyzer";

import {
  ExecutionMetricsEngine,
  ExecutionMetricInput,
} from "./metrics/execution-metrics.engine";

import {
  FailureAnalysisEngine,
  FailureAnalysisInput,
} from "./analyzers/failure-analysis.engine";

export interface IntelligenceReportInput {
  execution: ExecutionAnalyzerInput;
  metrics: ExecutionMetricInput;
  failures: FailureAnalysisInput[];
}

export interface IntelligenceReport {
  executionId: string;
  analysis: unknown;
  metrics: unknown;
  failures: unknown[];
  generatedAt: Date;
}

export class IntelligenceReportAggregator {
  private readonly analyzer =
    new ExecutionAnalyzer();

  private readonly metricsEngine =
    new ExecutionMetricsEngine();

  private readonly failureEngine =
    new FailureAnalysisEngine();

  generate(
    input: IntelligenceReportInput,
  ): IntelligenceReport {
    return {
      executionId:
        input.execution.executionId,

      analysis:
        this.analyzer.analyze(
          input.execution,
        ),

      metrics:
        this.metricsEngine.calculate(
          input.metrics,
        ),

      failures:
        input.failures.map(
          (failure) =>
            this.failureEngine.analyze(
              failure,
            ),
        ),

      generatedAt:
        new Date(),
    };
  }
}
