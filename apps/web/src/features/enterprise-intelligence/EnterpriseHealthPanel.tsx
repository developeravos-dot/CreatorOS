import type {
  EnterpriseIntelligenceSnapshot,
} from "./enterprise-intelligence-types";

interface EnterpriseHealthPanelProps {
  health:
    EnterpriseIntelligenceSnapshot["health"];
}

export default function EnterpriseHealthPanel({
  health,
}: EnterpriseHealthPanelProps) {
  return (
    <article className="enterprise-intelligence-panel">
      <header className="enterprise-intelligence-panel__header">
        <div>
          <span>
            SYSTEM INTELLIGENCE
          </span>

          <h3>
            Enterprise health
          </h3>
        </div>

        <strong
          className={[
            "enterprise-intelligence-health-score",
            `enterprise-intelligence-health-score--${health.status}`,
          ].join(" ")}
        >
          {health.score}%
        </strong>
      </header>

      <div className="enterprise-intelligence-health-list">
        {health.items.map((item) => (
          <div key={item.id}>
            <section>
              <span
                className={
                  item.healthy
                    ? "enterprise-intelligence-health-dot--healthy"
                    : "enterprise-intelligence-health-dot--attention"
                }
              />

              <div>
                <strong>
                  {item.label}
                </strong>

                <small>
                  {item.status}
                </small>
              </div>
            </section>

            <strong>
              {item.score}%
            </strong>
          </div>
        ))}
      </div>
    </article>
  );
}
