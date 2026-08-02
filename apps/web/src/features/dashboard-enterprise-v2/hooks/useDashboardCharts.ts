import {
  useMemo,
  useState,
} from "react";

import type {
  EnterpriseDashboard,
} from "../../../enterprise-api";

import {
  buildDashboardChartSnapshot,
} from "../intelligence/dashboard-kpi-intelligence-engine";

import {
  type DashboardPeriod,
} from "../intelligence/dashboard-period";

interface UseDashboardChartsOptions {
  dashboard:
    EnterpriseDashboard;

  initialPeriod?:
    DashboardPeriod;
}

export function useDashboardCharts({
  dashboard,
  initialPeriod = "30d",
}: UseDashboardChartsOptions) {
  const [
    period,
    setPeriod,
  ] = useState<DashboardPeriod>(
    initialPeriod,
  );

  const snapshot =
    useMemo(
      () =>
        buildDashboardChartSnapshot(
          dashboard,
          period,
        ),
      [
        dashboard,
        period,
      ],
    );

  return {
    period,
    setPeriod,
    snapshot,
  };
}
