import type {
  DashboardMetricTone,
} from "../dashboard-foundation-types";

import type {
  DashboardPeriod,
} from "./dashboard-period";

export interface DashboardTimePoint {
  timestamp: string;
  label: string;
  value: number;
}

export interface DashboardTimeSeries {
  id: string;
  label: string;
  description: string;
  tone: DashboardMetricTone;
  points: DashboardTimePoint[];
}

export interface DashboardKpiDelta {
  current: number;
  previous: number;
  absolute: number;
  percentage: number;
  direction:
    | "up"
    | "down"
    | "stable";

  label: string;
}

export interface DashboardKpiInsight {
  id: string;
  label: string;
  value: number;
  formattedValue: string;
  tone: DashboardMetricTone;
  delta: DashboardKpiDelta;
  sparkline: number[];
  description: string;
}

export interface DashboardChartSnapshot {
  generatedAt: string;
  period: DashboardPeriod;
  series: DashboardTimeSeries[];
  insights: DashboardKpiInsight[];
  totals: {
    production: number;
    publishing: number;
    automation: number;
    engagement: number;
  };
}
