import { useTranslation } from "../../hooks";
import type { AIStudioAgent } from "./ai-studio-types";
import AgentStatusBadge from "./AgentStatusBadge";

interface AIAgentsGridProps {
  agents: AIStudioAgent[];
  selectedId: string | null;
  onSelect: (agent: AIStudioAgent) => void;
}

export default function AIAgentsGrid({
  agents,
  selectedId,
  onSelect,
}: AIAgentsGridProps) {
  const { t } = useTranslation();

  return (
    <section className="ai-studio-panel ai-studio-agents">
      <header className="ai-studio-panel__header">
        <div>
          <span>{t("aiStudio.agents")}</span>
          <h3>{t("aiStudio.digitalOrganization")}</h3>
        </div>

        <strong>{agents.length}</strong>
      </header>

      <div className="ai-studio-agents__grid">
        {agents.map((agent) => (
          <button
            type="button"
            key={agent.id}
            className={[
              "ai-studio-agent-card",
              selectedId === agent.id
                ? "ai-studio-agent-card--selected"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => onSelect(agent)}
          >
            <header>
              <span className="ai-studio-agent-card__icon">
                {agent.icon}
              </span>

              <AgentStatusBadge status={agent.status} />
            </header>

            <div>
              <h4>{agent.name}</h4>
              <span>{agent.role}</span>
              <p>{agent.description}</p>
            </div>

            <footer>
              <span>
                <small>{t("aiStudio.tasks")}</small>
                <strong>{agent.tasks}</strong>
              </span>

              <span>
                <small>{t("aiStudio.success")}</small>
                <strong>{agent.successRate}%</strong>
              </span>

              <span>
                <small>{t("aiStudio.model")}</small>
                <strong>{agent.model}</strong>
              </span>
            </footer>
          </button>
        ))}
      </div>
    </section>
  );
}
