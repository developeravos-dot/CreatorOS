import {
  EmptyState,
} from "../../../design-system";

export default function DashboardChartsEmptyState() {
  return (
    <div className="dashboard-enterprise-charts-state">
      <EmptyState
        title="No KPI chart data available"
        description={
          "Create projects, scripts, prompts or scheduled content to initialize KPI intelligence."
        }
      />
    </div>
  );
}
