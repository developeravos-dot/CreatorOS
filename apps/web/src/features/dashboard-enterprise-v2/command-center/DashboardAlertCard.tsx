import type {
  DashboardOperationalAlert,
} from "./dashboard-command-center-types";

interface DashboardAlertCardProps {
  alert:
    DashboardOperationalAlert;

  onAction?: (
    alert:
      DashboardOperationalAlert,
  ) => void;
}

export default function DashboardAlertCard({
  alert,
  onAction,
}: DashboardAlertCardProps) {
  return (
    <article
      className={[
        "dashboard-enterprise-alert-card",
        `dashboard-enterprise-alert-card--${alert.severity}`,
      ].join(" ")}
    >
      <span
        className="dashboard-enterprise-alert-card__indicator"
        aria-hidden="true"
      />

      <div className="dashboard-enterprise-alert-card__content">
        <header>
          <strong>
            {alert.title}
          </strong>

          <span>
            {alert.severity}
          </span>
        </header>

        <p>
          {alert.description}
        </p>

        {alert.actionLabel &&
        onAction ? (
          <button
            type="button"
            onClick={() =>
              onAction(alert)
            }
          >
            {alert.actionLabel}
          </button>
        ) : null}
      </div>
    </article>
  );
}
