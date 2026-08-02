import type {
  EnterpriseDashboard,
} from "../../enterprise-api";

import DashboardFoundationShell from "./components/DashboardFoundationShell";
import DashboardIntelligenceOverview from "./charts/DashboardIntelligenceOverview";

import {
  useDashboardCharts,
} from "./hooks/useDashboardCharts";

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
  const foundation =
    useDashboardFoundation({
      dashboard,
      connected,
    });

  const {
    period,
    setPeriod,
    snapshot:
      chartSnapshot,
  } = useDashboardCharts({
    dashboard,
  });

  return (
    <div className="dashboard-enterprise-v2-stack">
      <DashboardFoundationShell
        snapshot={foundation}
        loading={loading}
        refreshing={
          refreshing
        }
        error={error}
        onRefresh={onRefresh}
      />

      {!loading && !error ? (
        <DashboardIntelligenceOverview
          snapshot={
            chartSnapshot
          }
          period={period}
          loading={
            refreshing
          }
          onPeriodChange={
            setPeriod
          }
        />
      ) : null}
    </div>
  );
}
