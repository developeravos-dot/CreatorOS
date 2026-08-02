import type {
  EnterpriseDashboard,
} from "../../enterprise-api";

export type DashboardMetricTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger";

export type DashboardTrendDirection =
  | "up"
  | "down"
  | "stable";

export interface DashboardTrend {
  direction:
    DashboardTrendDirection;

  value: number;
  label: string;
}

export interface DashboardMetric {
  id: string;
  label: string;
  value: number;
  formattedValue: string;
  description: string;
  tone: DashboardMetricTone;
  trend?: DashboardTrend;
  progress?: number;
}

export interface DashboardOperationalStatus {
  id: string;
  label: string;
  value: string;
  tone: DashboardMetricTone;
  description: string;
}

export interface DashboardSummary {
  totalEntities: number;
  productionReadiness: number;
  activeRatio: number;
  schedulingRatio: number;
  automationRatio: number;
}

export interface DashboardFoundationSnapshot {
  generatedAt: string;
  connected: boolean;
  metrics: DashboardMetric[];
  statuses:
    DashboardOperationalStatus[];

  summary: DashboardSummary;
}

export interface DashboardFoundationInput {
  dashboard: EnterpriseDashboard;
  connected: boolean;
}
