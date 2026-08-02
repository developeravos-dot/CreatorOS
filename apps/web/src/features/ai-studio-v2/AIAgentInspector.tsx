import { useTranslation } from "../../hooks";
import type { AIStudioAgent } from "./ai-studio-types";
import AgentStatusBadge from "./AgentStatusBadge";

interface AIAgentInspectorProps {
  agent: AIStudioAgent | null;
  onClose: () => void;
}

export default function AIAgentInspector({
  agent,
  onClose,
}: AIAgentInspectorProps) {
  const { t } = useTranslation();

  if (!agent) {
    return null;
  }

  return (
    <div
      className="ai-studio-inspector-overlay"
      onMouseDown={onClose}
    >
      <aside
        className="ai-studio-inspector"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <span>{t("aiStudio.agentInspector")}</span>
            <h2>{agent.name}</h2>
          </div>

          <button type="button" onClick={onClose}>
            ×
          </button>
        </header>

        <div className="ai-studio-inspector__identity">
          <span>{agent.icon}</span>

          <div>
            <strong>{agent.role}</strong>
            <AgentStatusBadge status={agent.status} />
          </div>
        </div>

        <p>{agent.description}</p>

        <dl>
          <div>
            <dt>{t("aiStudio.model")}</dt>
            <dd>{agent.model}</dd>
          </div>

          <div>
            <dt>{t("aiStudio.tasks")}</dt>
            <dd>{agent.tasks}</dd>
          </div>

          <div>
            <dt>{t("aiStudio.successRate")}</dt>
            <dd>{agent.successRate}%</dd>
          </div>
        </dl>

        <footer>
          <button
            type="button"
            className="ai-studio-button"
          >
            {t("aiStudio.configure")}
          </button>

          <button
            type="button"
            className="ai-studio-button ai-studio-button--primary"
          >
            {t("aiStudio.openAgent")}
          </button>
        </footer>
      </aside>
    </div>
  );
}
