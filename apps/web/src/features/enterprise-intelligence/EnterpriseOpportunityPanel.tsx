import type {
  RevenueOpportunity,
} from "./enterprise-intelligence-types";

interface EnterpriseOpportunityPanelProps {
  opportunities:
    RevenueOpportunity[];
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

export default function EnterpriseOpportunityPanel({
  opportunities,
}: EnterpriseOpportunityPanelProps) {
  return (
    <article className="enterprise-intelligence-panel">
      <header className="enterprise-intelligence-panel__header">
        <div>
          <span>
            OPPORTUNITY SCORING
          </span>

          <h3>
            Top monetization opportunities
          </h3>
        </div>

        <strong>
          {opportunities.length}
        </strong>
      </header>

      <div className="enterprise-opportunity-list">
        {opportunities.map(
          (
            opportunity,
            index,
          ) => (
            <article
              className={[
                "enterprise-opportunity-item",
                `enterprise-opportunity-item--${opportunity.priority}`,
              ].join(" ")}
              key={opportunity.id}
            >
              <header>
                <div>
                  <span>
                    #{index + 1}
                  </span>

                  <section>
                    <strong>
                      {
                        opportunity.title
                      }
                    </strong>

                    <small>
                      {
                        opportunity.type
                      }
                    </small>
                  </section>
                </div>

                <strong>
                  {opportunity.score}
                </strong>
              </header>

              <p>
                {
                  opportunity.description
                }
              </p>

              <section className="enterprise-opportunity-metrics">
                <div>
                  <span>
                    Readiness
                  </span>

                  <strong>
                    {
                      opportunity.readiness
                    }%
                  </strong>
                </div>

                <div>
                  <span>
                    Confidence
                  </span>

                  <strong>
                    {
                      opportunity.confidence
                    }%
                  </strong>
                </div>

                <div>
                  <span>
                    Estimated value
                  </span>

                  <strong>
                    {formatMoney(
                      opportunity.estimatedValue,
                    )}
                  </strong>
                </div>
              </section>

              <footer>
                {opportunity.rationale.map(
                  (reason) => (
                    <span key={reason}>
                      {reason}
                    </span>
                  ),
                )}
              </footer>
            </article>
          ),
        )}
      </div>
    </article>
  );
}
