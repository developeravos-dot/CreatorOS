import DashboardQuickCommandCard from "./DashboardQuickCommandCard";

import type {
  DashboardQuickCommand,
} from "./dashboard-command-center-types";

interface DashboardQuickActionsPanelProps {
  commands:
    DashboardQuickCommand[];

  onCommand: (
    command:
      DashboardQuickCommand,
  ) => void;
}

export default function DashboardQuickActionsPanel({
  commands,
  onCommand,
}: DashboardQuickActionsPanelProps) {
  return (
    <div className="dashboard-enterprise-command-grid">
      {commands.map(
        (command) => (
          <DashboardQuickCommandCard
            key={command.id}
            command={command}
            onRun={onCommand}
          />
        ),
      )}
    </div>
  );
}
