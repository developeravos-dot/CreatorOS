import {
  useMemo,
} from "react";

import type {
  EnterpriseDashboard,
} from "../../../enterprise-api";

import {
  buildDashboardFoundation,
} from "../engine/dashboard-foundation-engine";

import type {
  DashboardFoundationSnapshot,
} from "../dashboard-foundation-types";

interface UseDashboardFoundationOptions {
  dashboard:
    EnterpriseDashboard;

  connected: boolean;
}

export function useDashboardFoundation({
  dashboard,
  connected,
}: UseDashboardFoundationOptions):
  DashboardFoundationSnapshot {
  return useMemo(
    () =>
      buildDashboardFoundation({
        dashboard,
        connected,
      }),
    [
      connected,
      dashboard,
    ],
  );
}
