import type {
  EnterpriseDashboard,
} from "../../../enterprise-api";

import {
  formatMetricValue,
} from "../engine/dashboard-math";

import {
  calculateDelta,
  normalizeSeriesValues,
} from "./dashboard-data-normalizer";

import {
  buildDashboardTimeSeries,
} from "./dashboard-time-series-engine";

import type {
  DashboardChartSnapshot,
  DashboardKpiInsight,
  DashboardTimeSeries,
} from "./dashboard-chart-types";

import type {
  DashboardPeriod,
} from "./dashboard-period";

function buildDeltaLabel(
  direction:
    | "up"
    | "down"
    | "stable",
  percentage: number,
): string {
  if (
    direction === "stable"
  ) {
    return "No change";
  }

  return `${percentage}% ${
    direction === "up"
      ? "increase"
      : "decrease"
  }`;
}

function buildInsight(
  series:
    DashboardTimeSeries,
): DashboardKpiInsight {
  const values =
    series.points.map(
      (point) =>
        point.value,
    );

  const current =
    values.at(-1) ?? 0;

  const previous =
    values.at(-2) ?? current;

  const delta =
    calculateDelta(
      current,
      previous,
    );

  return {
    id: series.id,
    label: series.label,
    value: current,
    formattedValue:
      formatMetricValue(
        current,
      ),
    tone: series.tone,
    description:
      series.description,
    sparkline:
      normalizeSeriesValues(
        values,
      ),
    delta: {
      current,
      previous,
      absolute:
        delta.absolute,
      percentage:
        delta.percentage,
      direction:
        delta.direction,
      label:
        buildDeltaLabel(
          delta.direction,
          delta.percentage,
        ),
    },
  };
}

export function buildDashboardChartSnapshot(
  dashboard:
    EnterpriseDashboard,
  period:
    DashboardPeriod,
): DashboardChartSnapshot {
  const series =
    buildDashboardTimeSeries(
      dashboard,
      period,
    );

  const insights =
    series.map(
      buildInsight,
    );

  const getValue = (
    id: string,
  ): number =>
    insights.find(
      (insight) =>
        insight.id === id,
    )?.value ?? 0;

  return {
    generatedAt:
      new Date().toISOString(),

    period,
    series,
    insights,

    totals: {
      production:
        getValue(
          "production",
        ),

      publishing:
        getValue(
          "publishing",
        ),

      automation:
        getValue(
          "automation",
        ),

      engagement:
        getValue(
          "engagement",
        ),
    },
  };
}
