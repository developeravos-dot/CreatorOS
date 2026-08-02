export type DashboardPerformanceStatus =
  | "healthy"
  | "warning"
  | "critical";

export interface DashboardPerformanceMetric {
  id: string;
  label: string;
  value: number;
  unit: "ms" | "count" | "kb";
  threshold: number;
  status:
    DashboardPerformanceStatus;

  description: string;
}

export interface DashboardPerformanceSnapshot {
  generatedAt: string;

  metrics:
    DashboardPerformanceMetric[];

  summary: {
    healthy: number;
    warning: number;
    critical: number;
    score: number;
  };
}

export interface DashboardRenderMeasurement {
  id: string;
  durationMs: number;
  timestamp: string;
}
