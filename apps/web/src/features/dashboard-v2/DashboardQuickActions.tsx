export interface DashboardQuickAction {
  id: string;
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
}

interface DashboardQuickActionsProps {
  actions: DashboardQuickAction[];
}

export default function DashboardQuickActions({
  actions,
}: DashboardQuickActionsProps) {
  return (
    <div className="dashboard-v2-actions">
      {actions.map((action) => (
        <button
          type="button"
          key={action.id}
          disabled={action.disabled}
          onClick={action.onClick}
        >
          <span>{action.icon}</span>

          <div>
            <strong>{action.title}</strong>
            <small>{action.description}</small>
          </div>
        </button>
      ))}
    </div>
  );
}
