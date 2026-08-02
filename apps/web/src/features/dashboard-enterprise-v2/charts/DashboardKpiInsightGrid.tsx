import DashboardKpiInsightCard from "./DashboardKpiInsightCard";

import type {
  DashboardKpiInsight,
} from "../intelligence/dashboard-chart-types";

interface DashboardKpiInsightGridProps {
  insights:
    DashboardKpiInsight[];
}

export default function DashboardKpiInsightGrid({
  insights,
}: DashboardKpiInsightGridProps) {
  return (
    <div className="dashboard-enterprise-kpi-insight-grid">
      {insights.map(
        (insight) => (
          <DashboardKpiInsightCard
            key={insight.id}
            insight={insight}
          />
        ),
      )}
    </div>
  );
}
