import { useTranslation } from "../../hooks";

export default function AIControlCenter() {
  const { t } = useTranslation();

  const controlItems = [
    {
      id: "router",
      icon: "⇄",
      title: t("aiStudio.modelRouter"),
      value: "4",
      description: t("aiStudio.connectedModels"),
    },
    {
      id: "cost",
      icon: "$",
      title: t("aiStudio.costMonitor"),
      value: "$12.40",
      description: t("aiStudio.todayUsage"),
    },
    {
      id: "memory",
      icon: "◫",
      title: t("aiStudio.memory"),
      value: "24",
      description: t("aiStudio.knowledgeSources"),
    },
    {
      id: "tools",
      icon: "⌘",
      title: t("aiStudio.tools"),
      value: "18",
      description: t("aiStudio.registeredTools"),
    },
  ];

  return (
    <section className="ai-studio-panel ai-studio-controls">
      <header className="ai-studio-panel__header">
        <div>
          <span>{t("aiStudio.controlPlane")}</span>
          <h3>{t("aiStudio.runtimeResources")}</h3>
        </div>
      </header>

      <div className="ai-studio-controls__grid">
        {controlItems.map((item) => (
          <article key={item.id}>
            <span>{item.icon}</span>

            <div>
              <small>{item.title}</small>
              <strong>{item.value}</strong>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
