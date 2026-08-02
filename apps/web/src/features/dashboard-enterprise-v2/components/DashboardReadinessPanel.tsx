import type {
  DashboardSummary,
} from "../dashboard-foundation-types";

interface DashboardReadinessPanelProps {
  summary: DashboardSummary;
}

interface ReadinessItem {
  id: string;
  label: string;
  value: number;
}

function readinessTone(
  value: number,
): string {
  if (value >= 75) {
    return "success";
  }

  if (value >= 45) {
    return "info";
  }

  if (value > 0) {
    return "warning";
  }

  return "danger";
}

export default function DashboardReadinessPanel({
  summary,
}: DashboardReadinessPanelProps) {
  const items:
    ReadinessItem[] = [
    {
      id: "active",
      label:
        "Active project ratio",
      value:
        summary.activeRatio,
    },
    {
      id: "schedule",
      label:
        "Scheduling coverage",
      value:
        summary.schedulingRatio,
    },
    {
      id: "automation",
      label:
        "Automation coverage",
      value:
        summary.automationRatio,
    },
  ];

  return (
    <section className="dashboard-enterprise-readiness">
      <div
        className={[
          "dashboard-enterprise-readiness__score",
          `dashboard-enterprise-readiness__score--${readinessTone(
            summary.productionReadiness,
          )}`,
        ].join(" ")}
      >
        <div>
          <strong>
            {
              summary.productionReadiness
            }%
          </strong>

          <span>
            Production readiness
          </span>
        </div>
      </div>

      <div className="dashboard-enterprise-readiness__details">
        <header>
          <div>
            <span>
              Enterprise readiness
            </span>

            <h3>
              Operational maturity
            </h3>
          </div>

          <strong>
            {
              summary.totalEntities
            } entities
          </strong>
        </header>

        <div className="dashboard-enterprise-readiness__items">
          {items.map(
            (item) => (
              <article
                key={item.id}
              >
                <div>
                  <span>
                    {item.label}
                  </span>

                  <strong>
                    {item.value}%
                  </strong>
                </div>

                <div
                  className="dashboard-enterprise-readiness__bar"
                  role="progressbar"
                  aria-label={
                    item.label
                  }
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={
                    item.value
                  }
                >
                  <span
                    style={{
                      width:
                        `${item.value}%`,
                    }}
                  />
                </div>
              </article>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
