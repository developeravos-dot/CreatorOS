import {
  StatusBadge,
  WorkspaceHeader,
} from "../../../design-system";

import DashboardConnectionBadge from "./DashboardConnectionBadge";

interface DashboardFoundationHeaderProps {
  connected: boolean;
  busy: boolean;
  totalEntities: number;
  productionReadiness: number;
  onRefresh?: () => void;
}

export default function DashboardFoundationHeader({
  connected,
  busy,
  totalEntities,
  productionReadiness,
  onRefresh,
}: DashboardFoundationHeaderProps) {
  return (
    <WorkspaceHeader
      eyebrow="CREATOROS ENTERPRISE"
      title="Dashboard 2.0"
      description={
        "A unified command center for production, publishing, automation and enterprise intelligence."
      }
      metadata={
        <>
          <DashboardConnectionBadge
            connected={
              connected
            }
          />

          <StatusBadge tone="info">
            {totalEntities} entities
          </StatusBadge>

          <StatusBadge
            tone={
              productionReadiness >= 70
                ? "success"
                : productionReadiness >= 40
                  ? "warning"
                  : "danger"
            }
          >
            {productionReadiness}% ready
          </StatusBadge>
        </>
      }
      actions={
        onRefresh ? (
          <button
            type="button"
            disabled={busy}
            onClick={onRefresh}
          >
            {busy
              ? "Refreshing..."
              : "Refresh dashboard"}
          </button>
        ) : null
      }
    />
  );
}
