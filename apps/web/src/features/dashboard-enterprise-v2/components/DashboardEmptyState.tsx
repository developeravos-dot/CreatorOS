import {
  EmptyState,
} from "../../../design-system";

interface DashboardEmptyStateProps {
  onRefresh?: () => void;
}

export default function DashboardEmptyState({
  onRefresh,
}: DashboardEmptyStateProps) {
  return (
    <div className="dashboard-enterprise-state">
      <EmptyState
        title="Dashboard has no enterprise data"
        description={
          "Create a project, script, scheduled item or prompt to initialize Dashboard 2.0."
        }
        action={
          onRefresh ? (
            <button
              type="button"
              onClick={onRefresh}
            >
              Refresh dashboard
            </button>
          ) : undefined
        }
      />
    </div>
  );
}
