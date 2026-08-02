import {
  EmptyState,
} from "../../../design-system";

import DashboardAlertCard from "./DashboardAlertCard";

import type {
  DashboardOperationalAlert,
} from "./dashboard-command-center-types";

interface DashboardAlertsPanelProps {
  alerts:
    DashboardOperationalAlert[];

  onAction?: (
    alert:
      DashboardOperationalAlert,
  ) => void;
}

export default function DashboardAlertsPanel({
  alerts,
  onAction,
}: DashboardAlertsPanelProps) {
  if (
    alerts.length === 0
  ) {
    return (
      <EmptyState
        title="No operational alerts"
        description={
          "All monitored CreatorOS pipelines are currently within expected operating conditions."
        }
      />
    );
  }

  return (
    <div className="dashboard-enterprise-alert-list">
      {alerts.map(
        (alert) => (
          <DashboardAlertCard
            key={alert.id}
            alert={alert}
            onAction={
              onAction
            }
          />
        ),
      )}
    </div>
  );
}
