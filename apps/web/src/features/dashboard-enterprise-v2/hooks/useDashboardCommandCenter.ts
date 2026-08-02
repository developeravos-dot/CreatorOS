import {
  useMemo,
} from "react";

import type {
  EnterpriseDashboard,
} from "../../../enterprise-api";

import {
  buildDashboardCommandCenter,
} from "../command-center/dashboard-command-center-engine";

interface UseDashboardCommandCenterOptions {
  dashboard:
    EnterpriseDashboard;

  connected: boolean;
  busy: boolean;
}

export function useDashboardCommandCenter({
  dashboard,
  connected,
  busy,
}: UseDashboardCommandCenterOptions) {
  return useMemo(
    () =>
      buildDashboardCommandCenter({
        dashboard,
        connected,
        busy,
      }),
    [
      busy,
      connected,
      dashboard,
    ],
  );
}
