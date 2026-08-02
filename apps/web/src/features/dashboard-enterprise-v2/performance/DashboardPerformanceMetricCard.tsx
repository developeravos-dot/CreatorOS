import type {
  DashboardPerformanceMetric,
} from "./dashboard-performance-types";

interface DashboardPerformanceMetricCardProps {
  metric:
    DashboardPerformanceMetric;
}

export default function DashboardPerformanceMetricCard({
  metric,
}: DashboardPerformanceMetricCardProps) {
  return (
    <article
      className={[
        "dashboard-performance-metric",
        `dashboard-performance-metric--${metric.status}`,
      ].join(" ")}
    >
      <header>
        <span>
          {metric.label}
        </span>

        <small>
          {metric.status}
        </small>
      </header>

      <strong>
        {metric.value}
        <small>
          {metric.unit}
        </small>
      </strong>

      <p>
        {metric.description}
      </p>

      <footer>
        Threshold: {metric.threshold}
        {metric.unit}
      </footer>
    </article>
  );
}
