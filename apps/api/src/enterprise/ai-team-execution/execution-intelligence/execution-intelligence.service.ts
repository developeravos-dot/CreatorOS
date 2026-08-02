import { Injectable } from "@nestjs/common";

import {
  ExecutionAnalyzer,
  ExecutionAnalyzerInput,
} from "./analyzers/execution-analyzer";

import {
  ExecutionIntelligenceReport,
} from "./models/execution-intelligence.types";

@Injectable()
export class ExecutionIntelligenceService {
  private readonly analyzer =
    new ExecutionAnalyzer();

  analyzeExecution(
    input: ExecutionAnalyzerInput,
  ): ExecutionIntelligenceReport {
    const analysis =
      this.analyzer.analyze(input);

    return {
      executionId: input.executionId,
      analysis,
      insights:
        this.generateInsights(analysis),
      recommendations:
        this.generateRecommendations(analysis),
    };
  }

  private generateInsights(
    analysis: any,
  ): string[] {
    const insights: string[] = [];

    if (
      analysis.performance.successRate >= 90
    ) {
      insights.push(
        "Execution completed with high reliability.",
      );
    }

    if (
      analysis.performance.failureRate > 0
    ) {
      insights.push(
        "Execution contains failed operations requiring analysis.",
      );
    }

    return insights;
  }

  private generateRecommendations(
    analysis: any,
  ): string[] {
    const recommendations: string[] = [];

    if (
      analysis.status === "CRITICAL"
    ) {
      recommendations.push(
        "Review failed steps and runtime execution strategy.",
      );
    }

    if (
      analysis.status === "WARNING"
    ) {
      recommendations.push(
        "Optimize execution flow and monitor performance.",
      );
    }

    return recommendations;
  }
}
