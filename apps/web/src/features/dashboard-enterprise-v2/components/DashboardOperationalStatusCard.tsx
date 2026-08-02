import {
  StatusBadge,
} from "../../../design-system";

import type {
  DashboardOperationalStatus,
} from "../dashboard-foundation-types";

interface DashboardOperationalStatusCardProps {
  status:
    DashboardOperationalStatus;
}

export default function DashboardOperationalStatusCard({
  status,
}: DashboardOperationalStatusCardProps) {
  return (
    <article className="dashboard-enterprise-status-card">
      <header>
        <span>
          {status.label}
        </span>

        <StatusBadge
          tone={status.tone}
        >
          {status.value}
        </StatusBadge>
      </header>

      <p>
        {status.description}
      </p>
    </article>
  );
}
