import type {
  IntelligenceKpi,
} from "./enterprise-intelligence-types";

interface EnterpriseKpiGridProps {
  kpis: IntelligenceKpi[];
}

function trendIcon(
  trend: IntelligenceKpi["trend"],
): string {
  if (trend === "up") {
    return "↗";
  }

  if (trend === "down") {
    return "↘";
  }

  return "→";
}

export default function EnterpriseKpiGrid({
  kpis,
}: EnterpriseKpiGridProps) {
  return (
    <section className="enterprise-intelligence-kpis">
      {kpis.map((kpi) => (
        <article
          className={[
            "enterprise-intelligence-kpi",
            `enterprise-intelligence-kpi--${kpi.severity}`,
          ].join(" ")}
          key={kpi.id}
        >
          <header>
            <span>{kpi.label}</span>

            <strong>
              {trendIcon(kpi.trend)}
            </strong>
          </header>

          <div className="enterprise-intelligence-kpi__value">
            {kpi.formattedValue}
          </div>

          <p>{kpi.description}</p>

          <footer>
            <span>
              Trend
            </span>

            <strong>
              {kpi.trendValue}
            </strong>
          </footer>
        </article>
      ))}
    </section>
  );
}
