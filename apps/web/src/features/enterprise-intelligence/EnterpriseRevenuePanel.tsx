import type {
  EnterpriseRevenueIntelligence,
} from "./enterprise-intelligence-types";

interface EnterpriseRevenuePanelProps {
  revenue:
    EnterpriseRevenueIntelligence;
}

function formatMoney(
  value: number,
): string {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    },
  ).format(value);
}

export default function EnterpriseRevenuePanel({
  revenue,
}: EnterpriseRevenuePanelProps) {
  const metrics = [
    {
      id: "readiness",
      label:
        "Revenue readiness",
      value:
        `${revenue.readinessScore}%`,
    },
    {
      id: "monetization",
      label:
        "Monetization score",
      value:
        `${revenue.monetizationScore}%`,
    },
    {
      id: "sponsorship",
      label:
        "Sponsorship readiness",
      value:
        `${revenue.sponsorshipReadiness}%`,
    },
    {
      id: "asset-leverage",
      label:
        "Content asset leverage",
      value:
        `${revenue.contentAssetLeverage}%`,
    },
  ];

  return (
    <article className="enterprise-intelligence-panel enterprise-revenue-panel">
      <header className="enterprise-intelligence-panel__header">
        <div>
          <span>
            REVENUE INTELLIGENCE
          </span>

          <h3>
            Monetization readiness
          </h3>
        </div>

        <strong className="enterprise-revenue-panel__score">
          {
            revenue.monetizationScore
          }%
        </strong>
      </header>

      <section className="enterprise-revenue-metrics">
        {metrics.map(
          (metric) => (
            <div key={metric.id}>
              <span>
                {metric.label}
              </span>

              <strong>
                {metric.value}
              </strong>
            </div>
          ),
        )}
      </section>

      <section className="enterprise-revenue-value">
        <div>
          <span>
            Estimated opportunity pipeline
          </span>

          <strong>
            {formatMoney(
              revenue.estimatedPipelineValue,
            )}
          </strong>
        </div>

        <div>
          <span>
            Estimated monthly potential
          </span>

          <strong>
            {formatMoney(
              revenue.estimatedMonthlyPotential,
            )}
          </strong>
        </div>
      </section>

      <p className="enterprise-revenue-disclaimer">
        Estimates are heuristic readiness indicators derived from current CreatorOS assets. They are not guaranteed revenue forecasts.
      </p>
    </article>
  );
}
