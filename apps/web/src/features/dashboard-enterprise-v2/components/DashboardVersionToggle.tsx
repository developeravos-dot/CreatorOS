interface DashboardVersionToggleProps {
  enterpriseEnabled: boolean;
  onToggle: () => void;
}

export default function DashboardVersionToggle({
  enterpriseEnabled,
  onToggle,
}: DashboardVersionToggleProps) {
  return (
    <button
      type="button"
      className="dashboard-enterprise-version-toggle"
      onClick={onToggle}
    >
      {enterpriseEnabled
        ? "Switch to legacy dashboard"
        : "Switch to Dashboard 2.0"}
    </button>
  );
}
