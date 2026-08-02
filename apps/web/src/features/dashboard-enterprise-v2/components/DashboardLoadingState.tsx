import {
  LoadingPanel,
} from "../../../design-system";

export default function DashboardLoadingState() {
  return (
    <div className="dashboard-enterprise-state">
      <LoadingPanel
        title="Loading Dashboard 2.0..."
        rows={6}
      />
    </div>
  );
}
