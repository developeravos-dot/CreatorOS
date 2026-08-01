import type { StudioAgent } from "./types";

interface AgentInspectorProps {
  agent: StudioAgent | null;
  onAddToPipeline: (agent: StudioAgent) => void;
}

export default function AgentInspector({
  agent,
  onAddToPipeline,
}: AgentInspectorProps) {
  if (!agent) {
    return (
      <aside className="ai-studio-inspector">
        <div className="ai-studio-empty">
          Select an agent to inspect its role and capabilities.
        </div>
      </aside>
    );
  }

  return (
    <aside className="ai-studio-inspector">
      <header className="ai-studio-section-header">
        <div>
          <span>AGENT DETAILS</span>
          <h3>{agent.name}</h3>
        </div>

        <strong className="ai-studio-inspector__icon">
          {agent.icon}
        </strong>
      </header>

      <div className="ai-studio-inspector__status">
        <span
          className={`ai-studio-agent-status ai-studio-agent-status--${agent.status}`}
        >
          {agent.status}
        </span>

        <small>{agent.category}</small>
      </div>

      <p className="ai-studio-inspector__description">
        {agent.description}
      </p>

      <section className="ai-studio-inspector__capabilities">
        <span>CAPABILITIES</span>

        <div>
          {agent.capabilities.map((capability) => (
            <small key={capability}>
              {capability}
            </small>
          ))}
        </div>
      </section>

      <button
        type="button"
        className="ai-studio-primary-button"
        onClick={() => onAddToPipeline(agent)}
      >
        ＋ Add to pipeline
      </button>

      <p className="ai-studio-integration-note">
        This workspace configures orchestration in the frontend.
        Backend agent execution will be connected through dedicated APIs.
      </p>
    </aside>
  );
}
