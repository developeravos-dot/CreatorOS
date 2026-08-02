import DashboardMetricGrid from "./DashboardMetricGrid";
import DashboardOperationalStatusGrid from "./DashboardOperationalStatusGrid";
import DashboardReadinessPanel from "./DashboardReadinessPanel";
import DashboardSection from "./DashboardSection";

import type {
  DashboardFoundationSnapshot,
} from "../dashboard-foundation-types";

interface DashboardFoundationOverviewProps {
  snapshot:
    DashboardFoundationSnapshot;
}

export default function DashboardFoundationOverview({
  snapshot,
}: DashboardFoundationOverviewProps) {
  return (
    <div className="dashboard-enterprise-overview">
      <DashboardSection
        title="Enterprise metrics"
        description={
          "Live production totals and operational coverage across CreatorOS."
        }
      >
        <DashboardMetricGrid
          metrics={
            snapshot.metrics
          }
        />
      </DashboardSection>

      <DashboardSection
        title="Production readiness"
        description={
          "A consolidated view of operational maturity and pipeline readiness."
        }
      >
        <DashboardReadinessPanel
          summary={
            snapshot.summary
          }
        />
      </DashboardSection>

      <DashboardSection
        title="Operational status"
        description={
          "Current availability of the primary CreatorOS enterprise pipelines."
        }
      >
        <DashboardOperationalStatusGrid
          statuses={
            snapshot.statuses
          }
        />
      </DashboardSection>
    </div>
  );
}
