import DashboardSparkline from "./DashboardSparkline";

import type {
  DashboardKpiInsight,
} from "../intelligence/dashboard-chart-types";

interface DashboardKpiInsightCardProps {
  insight:
    DashboardKpiInsight;
}

function deltaSymbol(
  direction:
    DashboardKpiInsight["delta"]["direction"],
): string {
  if (direction === "up") {
    return "↑";
  }

  if (direction === "down") {
    return "↓";
  }

  return "→";
}

export default function DashboardKpiInsightCard({
  insight,
}: DashboardKpiInsightCardProps) {
  return (
    <article
      className={[
        "dashboard-enterprise-kpi-insight",
        `dashboard-enterprise-kpi-insight--${insight.tone}`,
      ].join(" ")}
    >
      <header>
        <span>
          {insight.label}
        </span>

        <small
          className={`dashboard-enterprise-kpi-insight__delta dashboard-enterprise-kpi-insight__delta--${insight.delta.direction}`}
        >
          {deltaSymbol(
            insight.delta.direction,
          )}{" "}
          {insight.delta.label}
        </small>
      </header>

      <div className="dashboard-enterprise-kpi-insight__content">
        <div>
          <strong>
            {
              insight.formattedValue
            }
          </strong>

          <p>
            {insight.description}
          </p>
        </div>

        <DashboardSparkline
          values={
            insight.sparkline
          }
          label={`${insight.label} trend`}
        />
      </div>
    </article>
  );
}
