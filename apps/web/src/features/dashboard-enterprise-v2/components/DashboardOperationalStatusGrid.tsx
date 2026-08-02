import type {
  DashboardOperationalStatus,
} from "../dashboard-foundation-types";

import DashboardOperationalStatusCard from "./DashboardOperationalStatusCard";

interface DashboardOperationalStatusGridProps {
  statuses:
    DashboardOperationalStatus[];
}

export default function DashboardOperationalStatusGrid({
  statuses,
}: DashboardOperationalStatusGridProps) {
  return (
    <div className="dashboard-enterprise-status-grid">
      {statuses.map(
        (status) => (
          <DashboardOperationalStatusCard
            key={status.id}
            status={status}
          />
        ),
      )}
    </div>
  );
}
