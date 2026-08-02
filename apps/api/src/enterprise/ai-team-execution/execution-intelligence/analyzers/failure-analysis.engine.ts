export type FailureCategory =
  | "RUNTIME"
  | "AGENT"
  | "VALIDATION"
  | "TIMEOUT"
  | "UNKNOWN";

export interface FailureAnalysisInput {
  executionId: string;
  stepId?: string;
  errorMessage: string;
}

export interface FailureAnalysisResult {
  executionId: string;
  stepId?: string;
  category: FailureCategory;
  severity:
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "CRITICAL";
  reason: string;
  recommendation: string;
}

export class FailureAnalysisEngine {
  analyze(
    input: FailureAnalysisInput,
  ): FailureAnalysisResult {
    const category =
      this.detectCategory(
        input.errorMessage,
      );

    return {
      executionId: input.executionId,
      stepId: input.stepId,
      category,
      severity:
        this.calculateSeverity(category),
      reason:
        this.buildReason(category),
      recommendation:
        this.buildRecommendation(category),
    };
  }

  private detectCategory(
    message: string,
  ): FailureCategory {
    const error =
      message.toLowerCase();

    if (error.includes("timeout")) {
      return "TIMEOUT";
    }

    if (
      error.includes("agent") ||
      error.includes("model")
    ) {
      return "AGENT";
    }

    if (
      error.includes("validation") ||
      error.includes("invalid")
    ) {
      return "VALIDATION";
    }

    if (
      error.includes("runtime") ||
      error.includes("exception")
    ) {
      return "RUNTIME";
    }

    return "UNKNOWN";
  }

  private calculateSeverity(
    category: FailureCategory,
  ):
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "CRITICAL" {
    switch (category) {
      case "RUNTIME":
      case "AGENT":
        return "HIGH";

      case "TIMEOUT":
        return "MEDIUM";

      case "VALIDATION":
        return "LOW";

      default:
        return "CRITICAL";
    }
  }

  private buildReason(
    category: FailureCategory,
  ): string {
    return `Execution failure classified as ${category}.`;
  }

  private buildRecommendation(
    category: FailureCategory,
  ): string {
    switch (category) {
      case "AGENT":
        return "Review agent configuration and runtime selection.";

      case "TIMEOUT":
        return "Increase execution timeout or optimize workload.";

      case "VALIDATION":
        return "Review input data and execution parameters.";

      case "RUNTIME":
        return "Inspect runtime provider and execution logs.";

      default:
        return "Collect more execution context for analysis.";
    }
  }
}
