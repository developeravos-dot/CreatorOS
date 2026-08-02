export enum ExecutionHealthStatus {
  HEALTHY = "HEALTHY",
  WARNING = "WARNING",
  CRITICAL = "CRITICAL",
}

export interface ExecutionPerformanceScore {
  executionId: string;
  successRate: number;
  failureRate: number;
  averageDurationMs: number;
  score: number;
}

export interface ExecutionFailureInsight {
  executionId: string;
  failedStepId?: string;
  reason: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  recommendation: string;
}

export interface ExecutionAnalysis {
  executionId: string;
  status: ExecutionHealthStatus;
  performance: ExecutionPerformanceScore;
  failures: ExecutionFailureInsight[];
  generatedAt: Date;
}

export interface ExecutionIntelligenceReport {
  executionId: string;
  analysis: ExecutionAnalysis;
  insights: string[];
  recommendations: string[];
}
