import type {
  DashboardQuickCommand,
} from "./dashboard-command-center-types";

interface DashboardQuickCommandCardProps {
  command:
    DashboardQuickCommand;

  onRun: (
    command:
      DashboardQuickCommand,
  ) => void;
}

export default function DashboardQuickCommandCard({
  command,
  onRun,
}: DashboardQuickCommandCardProps) {
  return (
    <button
      type="button"
      disabled={
        command.disabled
      }
      className={[
        "dashboard-enterprise-command-card",
        `dashboard-enterprise-command-card--${command.tone}`,
      ].join(" ")}
      onClick={() =>
        onRun(command)
      }
    >
      <span
        className="dashboard-enterprise-command-card__icon"
        aria-hidden="true"
      >
        {command.icon}
      </span>

      <span className="dashboard-enterprise-command-card__content">
        <strong>
          {command.label}
        </strong>

        <small>
          {command.description}
        </small>
      </span>
    </button>
  );
}
