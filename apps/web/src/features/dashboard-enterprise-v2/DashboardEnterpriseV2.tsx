import type {
  EnterpriseDashboard,
} from "../../enterprise-api";

import DashboardFoundationShell from "./components/DashboardFoundationShell";

import {
  useDashboardFoundation,
} from "./hooks/useDashboardFoundation";

interface DashboardEnterpriseV2Props {
  dashboard:
    EnterpriseDashboard;

  connected: boolean;
  loading?: boolean;
  refreshing?: boolean;
  error?: string | null;

  onRefresh?: () => void;
}

export default function DashboardEnterpriseV2({
  dashboard,
  connected,
  loading = false,
  refreshing = false,
  error = null,
  onRefresh,
}: DashboardEnterpriseV2Props) {
  const snapshot =
    useDashboardFoundation({
      dashboard,
      connected,
    });

  return (
    <DashboardFoundationShell
      snapshot={snapshot}
      loading={loading}
      refreshing={refreshing}
      error={error}
      onRefresh={onRefresh}
    />
  );
}
