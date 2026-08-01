export interface DashboardMetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: string;
  trend?: string;
  status?: "positive" | "neutral" | "warning";
}

export default function DashboardMetricCard({
  title,
  value,
  description,
  icon,
  trend,
  status = "neutral",
}: DashboardMetricCardProps) {
  return (
    <article className="dashboard-v2-metric">
      <header className="dashboard-v2-metric__header">
        <span>{title}</span>
        <strong>{icon}</strong>
      </header>

      <div className="dashboard-v2-metric__value">{value}</div>

      <footer className="dashboard-v2-metric__footer">
        <span>{description}</span>

        {trend ? (
          <strong className={`dashboard-v2-status--${status}`}>
            {trend}
          </strong>
        ) : null}
      </footer>
    </article>
  );
}
