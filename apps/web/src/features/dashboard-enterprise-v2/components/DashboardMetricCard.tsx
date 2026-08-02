import type {
  DashboardMetric,
} from "../dashboard-foundation-types";

interface DashboardMetricCardProps {
  metric: DashboardMetric;
}

function trendIcon(
  direction:
    DashboardMetric["trend"] extends
      infer T
      ? T extends {
          direction: infer D;
        }
        ? D
        : never
      : never,
): string {
  if (direction === "up") {
    return "↑";
  }

  if (direction === "down") {
    return "↓";
  }

  return "→";
}

export default function DashboardMetricCard({
  metric,
}: DashboardMetricCardProps) {
  const progress =
    metric.progress ?? 0;

  return (
    <article
      className={[
        "dashboard-enterprise-metric-card",
        `dashboard-enterprise-metric-card--${metric.tone}`,
      ].join(" ")}
    >
      <header>
        <span>
          {metric.label}
        </span>

        {metric.trend ? (
          <small
            className={[
              "dashboard-enterprise-metric-card__trend",
              `dashboard-enterprise-metric-card__trend--${metric.trend.direction}`,
            ].join(" ")}
          >
            <span aria-hidden="true">
              {trendIcon(
                metric.trend.direction,
              )}
            </span>

            {metric.trend.label}
          </small>
        ) : null}
      </header>

      <strong>
        {metric.formattedValue}
      </strong>

      <p>
        {metric.description}
      </p>

      <div
        className="dashboard-enterprise-metric-card__progress"
        aria-label={`${metric.label} progress`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        role="progressbar"
      >
        <span
          style={{
            width:
              `${progress}%`,
          }}
        />
      </div>

      <footer>
        <span>
          Coverage
        </span>

        <strong>
          {progress}%
        </strong>
      </footer>
    </article>
  );
}
