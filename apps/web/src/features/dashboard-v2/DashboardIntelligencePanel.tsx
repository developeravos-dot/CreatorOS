import { useTranslation } from "../../hooks";

export default function DashboardIntelligencePanel() {
  const { t } = useTranslation();

  const intelligenceItems = [
    {
      title: t("dashboard.aiAgents"),
      value: "12",
      status: t("dashboard.active"),
    },
    {
      title: t("dashboard.contentPipeline"),
      value: t("dashboard.operational"),
      status: t("dashboard.healthy"),
    },
    {
      title: t("dashboard.productionHealth"),
      value: "98%",
      status: t("dashboard.optimal"),
    },
    {
      title: t("dashboard.nextActions"),
      value: "3",
      status: t("dashboard.recommendations"),
    },
  ];

  return (
    <article className="dashboard-v2-panel dashboard-v2-intelligence">
      <header className="dashboard-v2-panel__header">
        <div>
          <span>{t("dashboard.aiIntelligence")}</span>
          <h3>{t("dashboard.productionIntelligenceCenter")}</h3>
        </div>
      </header>

      <div className="dashboard-v2-intelligence__grid">
        {intelligenceItems.map((item) => (
          <div key={item.title}>
            <strong>{item.title}</strong>
            <span>{item.value}</span>
            <small>{item.status}</small>
          </div>
        ))}
      </div>
    </article>
  );
}
