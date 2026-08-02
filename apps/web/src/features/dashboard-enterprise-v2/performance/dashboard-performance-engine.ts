import type {
  DashboardPerformanceMetric,
  DashboardPerformanceSnapshot,
  DashboardPerformanceStatus,
  DashboardRenderMeasurement,
} from "./dashboard-performance-types";

function metricStatus(
  value: number,
  threshold: number,
): DashboardPerformanceStatus {
  if (
    value <= threshold
  ) {
    return "healthy";
  }

  if (
    value <= threshold * 1.5
  ) {
    return "warning";
  }

  return "critical";
}

function averageDuration(
  measurements:
    DashboardRenderMeasurement[],
): number {
  if (
    measurements.length === 0
  ) {
    return 0;
  }

  return Math.round(
    measurements.reduce(
      (
        total,
        measurement,
      ) =>
        total +
        measurement.durationMs,
      0,
    ) /
    measurements.length,
  );
}

function maximumDuration(
  measurements:
    DashboardRenderMeasurement[],
): number {
  if (
    measurements.length === 0
  ) {
    return 0;
  }

  return Math.round(
    Math.max(
      ...measurements.map(
        (measurement) =>
          measurement.durationMs,
      ),
    ),
  );
}

function buildMetric(
  id: string,
  label: string,
  value: number,
  unit:
    DashboardPerformanceMetric["unit"],
  threshold: number,
  description: string,
): DashboardPerformanceMetric {
  return {
    id,
    label,
    value,
    unit,
    threshold,
    status:
      metricStatus(
        value,
        threshold,
      ),
    description,
  };
}

export function buildDashboardPerformanceSnapshot(
  measurements:
    DashboardRenderMeasurement[],
  componentCount: number,
  estimatedBundleKb: number,
  generatedAt = new Date(),
): DashboardPerformanceSnapshot {
  const metrics:
    DashboardPerformanceMetric[] = [
    buildMetric(
      "average-render",
      "Average render",
      averageDuration(
        measurements,
      ),
      "ms",
      100,
      "Average measured Dashboard 2.0 render duration.",
    ),

    buildMetric(
      "slowest-render",
      "Slowest render",
      maximumDuration(
        measurements,
      ),
      "ms",
      250,
      "Slowest recorded dashboard rendering operation.",
    ),

    buildMetric(
      "component-count",
      "Active components",
      Math.max(
        0,
        componentCount,
      ),
      "count",
      150,
      "Estimated number of active Dashboard 2.0 components.",
    ),

    buildMetric(
      "bundle-size",
      "Dashboard bundle",
      Math.max(
        0,
        Math.round(
          estimatedBundleKb,
        ),
      ),
      "kb",
      300,
      "Estimated JavaScript footprint of dashboard features.",
    ),
  ];

  const healthy =
    metrics.filter(
      (metric) =>
        metric.status ===
        "healthy",
    ).length;

  const warning =
    metrics.filter(
      (metric) =>
        metric.status ===
        "warning",
    ).length;

  const critical =
    metrics.filter(
      (metric) =>
        metric.status ===
        "critical",
    ).length;

  const total =
    metrics.length;

  const score =
    total === 0
      ? 100
      : Math.max(
          0,
          Math.round(
            (
              (
                healthy +
                warning * 0.5
              ) /
              total
            ) * 100,
          ),
        );

  return {
    generatedAt:
      generatedAt.toISOString(),

    metrics,

    summary: {
      healthy,
      warning,
      critical,
      score,
    },
  };
}
