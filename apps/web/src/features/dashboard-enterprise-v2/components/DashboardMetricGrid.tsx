import type {
  DashboardMetric,
} from "../dashboard-foundation-types";

import DashboardMetricCard from "./DashboardMetricCard";

interface DashboardMetricGridProps {
  metrics: DashboardMetric[];
}

export default function DashboardMetricGrid({
  metrics,
}: DashboardMetricGridProps) {
  return (
    <div className="dashboard-enterprise-metric-grid">
      {metrics.map(
        (metric) => (
          <DashboardMetricCard
            key={metric.id}
            metric={metric}
          />
        ),
      )}
    </div>
  );
}
