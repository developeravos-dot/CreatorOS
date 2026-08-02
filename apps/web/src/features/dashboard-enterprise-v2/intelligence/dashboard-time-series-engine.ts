import type {
  EnterpriseDashboard,
} from "../../../enterprise-api";

import {
  getDashboardPeriodDays,
  type DashboardPeriod,
} from "./dashboard-period";

import type {
  DashboardTimePoint,
  DashboardTimeSeries,
} from "./dashboard-chart-types";

interface MetricSeed {
  id: string;
  label: string;
  description: string;
  value: number;
  tone:
    | "neutral"
    | "info"
    | "success"
    | "warning"
    | "danger";
}

function formatDateLabel(
  date: Date,
  period: DashboardPeriod,
): string {
  if (period === "1y") {
    return date.toLocaleDateString(
      "en-US",
      {
        month: "short",
      },
    );
  }

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    },
  );
}

function deterministicVariation(
  index: number,
  seed: number,
): number {
  const wave =
    Math.sin(
      (
        index +
        seed
      ) * 0.82,
    );

  const drift =
    Math.cos(
      (
        index +
        seed
      ) * 0.31,
    );

  return (
    wave * 0.16 +
    drift * 0.09
  );
}

function buildPoints(
  baseValue: number,
  period: DashboardPeriod,
  seed: number,
): DashboardTimePoint[] {
  const totalDays =
    getDashboardPeriodDays(
      period,
    );

  const pointCount =
    period === "1y"
      ? 12
      : period === "90d"
        ? 18
        : period === "30d"
          ? 15
          : 7;

  const interval =
    totalDays /
    Math.max(
      pointCount - 1,
      1,
    );

  const now =
    new Date();

  return Array.from(
    {
      length: pointCount,
    },
    (
      _,
      index,
    ) => {
      const date =
        new Date(now);

      date.setDate(
        now.getDate() -
        Math.round(
          totalDays -
          interval * index,
        ),
      );

      const growth =
        0.58 +
        (
          index /
          Math.max(
            pointCount - 1,
            1,
          )
        ) * 0.42;

      const variation =
        deterministicVariation(
          index,
          seed,
        );

      const value =
        Math.max(
          0,
          Math.round(
            baseValue *
            growth *
            (
              1 +
              variation
            ),
          ),
        );

      return {
        timestamp:
          date.toISOString(),
        label:
          formatDateLabel(
            date,
            period,
          ),
        value,
      };
    },
  );
}

function metricSeeds(
  dashboard:
    EnterpriseDashboard,
): MetricSeed[] {
  return [
    {
      id: "production",
      label:
        "Production output",
      description:
        "Combined project and script production activity.",
      value:
        dashboard.metrics.projects +
        dashboard.metrics.scripts,
      tone: "info",
    },
    {
      id: "publishing",
      label:
        "Publishing pipeline",
      description:
        "Scheduled content progressing toward publication.",
      value:
        dashboard.metrics
          .scheduledContent,
      tone: "success",
    },
    {
      id: "automation",
      label:
        "Automation assets",
      description:
        "Reusable prompts supporting AI-assisted workflows.",
      value:
        dashboard.metrics.prompts,
      tone: "warning",
    },
    {
      id: "engagement",
      label:
        "Active operations",
      description:
        "Active project participation across CreatorOS.",
      value:
        dashboard.metrics
          .activeProjects,
      tone: "success",
    },
  ];
}

export function buildDashboardTimeSeries(
  dashboard:
    EnterpriseDashboard,
  period:
    DashboardPeriod,
): DashboardTimeSeries[] {
  return metricSeeds(
    dashboard,
  ).map(
    (
      metric,
      index,
    ) => ({
      id: metric.id,
      label: metric.label,
      description:
        metric.description,
      tone: metric.tone,
      points: buildPoints(
        metric.value,
        period,
        index + 1,
      ),
    }),
  );
}
