import {
  useMemo,
  useSyncExternalStore,
} from "react";

import {
  buildDashboardPerformanceSnapshot,
} from "../performance/dashboard-performance-engine";

import {
  getDashboardRenderMeasurementsSnapshot,
  subscribeDashboardPerformance,
} from "../performance/dashboard-performance-store";

interface UseDashboardPerformanceOptions {
  componentCount?: number;
  estimatedBundleKb?: number;
}

export function useDashboardPerformance({
  componentCount = 0,
  estimatedBundleKb = 0,
}: UseDashboardPerformanceOptions = {}) {
  const measurements =
    useSyncExternalStore(
      subscribeDashboardPerformance,
      getDashboardRenderMeasurementsSnapshot,
      getDashboardRenderMeasurementsSnapshot,
    );

  return useMemo(
    () =>
      buildDashboardPerformanceSnapshot(
        [...measurements],
        componentCount,
        estimatedBundleKb,
      ),
    [
      componentCount,
      estimatedBundleKb,
      measurements,
    ],
  );
}
