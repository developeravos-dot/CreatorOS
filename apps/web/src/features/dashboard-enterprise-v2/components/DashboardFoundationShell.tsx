import {
  WorkspaceContent,
  WorkspaceShell,
} from "../../../design-system";

import DashboardEmptyState from "./DashboardEmptyState";
import DashboardErrorState from "./DashboardErrorState";
import DashboardFoundationHeader from "./DashboardFoundationHeader";
import DashboardFoundationOverview from "./DashboardFoundationOverview";
import DashboardLoadingState from "./DashboardLoadingState";

import type {
  DashboardFoundationSnapshot,
} from "../dashboard-foundation-types";

interface DashboardFoundationShellProps {
  snapshot:
    DashboardFoundationSnapshot;

  loading?: boolean;
  error?: string | null;
  refreshing?: boolean;

  onRefresh?: () => void;
}

export default function DashboardFoundationShell({
  snapshot,
  loading = false,
  error = null,
  refreshing = false,
  onRefresh,
}: DashboardFoundationShellProps) {
  const isEmpty =
    snapshot.summary
      .totalEntities === 0;

  return (
    <WorkspaceShell
      className="dashboard-enterprise-v2"
    >
      <DashboardFoundationHeader
        connected={
          snapshot.connected
        }
        busy={
          refreshing
        }
        totalEntities={
          snapshot.summary
            .totalEntities
        }
        productionReadiness={
          snapshot.summary
            .productionReadiness
        }
        onRefresh={
          onRefresh
        }
      />

      <WorkspaceContent>
        {loading ? (
          <DashboardLoadingState />
        ) : error ? (
          <DashboardErrorState
            message={error}
            onRetry={
              onRefresh
            }
          />
        ) : isEmpty ? (
          <DashboardEmptyState
            onRefresh={
              onRefresh
            }
          />
        ) : (
          <DashboardFoundationOverview
            snapshot={snapshot}
          />
        )}
      </WorkspaceContent>
    </WorkspaceShell>
  );
}
