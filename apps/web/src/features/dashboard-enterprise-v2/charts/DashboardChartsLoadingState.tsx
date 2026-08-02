import {
  LoadingPanel,
} from "../../../design-system";

export default function DashboardChartsLoadingState() {
  return (
    <div className="dashboard-enterprise-charts-state">
      <LoadingPanel
        title="Building KPI intelligence..."
        rows={4}
      />
    </div>
  );
}
