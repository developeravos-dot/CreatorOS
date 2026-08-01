import type {
  PipelineStep,
  StudioAgent,
} from "./types";

interface PipelineBuilderProps {
  steps: PipelineStep[];
  agents: StudioAgent[];
  activeStepId?: string;
  onRemove: (stepId: string) => void;
  onMove: (
    stepId: string,
    direction: "up" | "down",
  ) => void;
  onSelect: (step: PipelineStep) => void;
}

export default function PipelineBuilder({
  steps,
  agents,
  activeStepId,
  onRemove,
  onMove,
  onSelect,
}: PipelineBuilderProps) {
  if (steps.length === 0) {
    return (
      <section className="ai-studio-pipeline">
        <header className="ai-studio-section-header">
          <div>
            <span>WORKFLOW PIPELINE</span>
            <h3>Production flow</h3>
          </div>
        </header>

        <div className="ai-studio-empty ai-studio-empty--large">
          <strong>No pipeline steps</strong>
          <span>
            Select an agent and add it to build a workflow.
          </span>
        </div>
      </section>
    );
  }

  return (
    <section className="ai-studio-pipeline">
      <header className="ai-studio-section-header">
        <div>
          <span>WORKFLOW PIPELINE</span>
          <h3>Production flow</h3>
        </div>

        <small>{steps.length} steps</small>
      </header>

      <div className="ai-studio-pipeline__steps">
        {steps.map((step, index) => {
          const agent = agents.find(
            (item) => item.id === step.agentId,
          );

          return (
            <article
              key={step.id}
              className={[
                "ai-studio-pipeline-step",
                activeStepId === step.id
                  ? "ai-studio-pipeline-step--active"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => onSelect(step)}
            >
              <div className="ai-studio-pipeline-step__number">
                {index + 1}
              </div>

              <div className="ai-studio-pipeline-step__agent">
                <span>{agent?.icon ?? "✦"}</span>

                <div>
                  <strong>{step.title}</strong>
                  <small>{agent?.name ?? step.agentId}</small>
                </div>
              </div>

              <div className="ai-studio-pipeline-step__progress">
                <div>
                  <span style={{ width: `${step.progress}%` }} />
                </div>

                <small>{step.progress}%</small>
              </div>

              <span
                className={`ai-studio-step-status ai-studio-step-status--${step.status}`}
              >
                {step.status}
              </span>

              <div className="ai-studio-pipeline-step__actions">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={(event) => {
                    event.stopPropagation();
                    onMove(step.id, "up");
                  }}
                >
                  ↑
                </button>

                <button
                  type="button"
                  disabled={index === steps.length - 1}
                  onClick={(event) => {
                    event.stopPropagation();
                    onMove(step.id, "down");
                  }}
                >
                  ↓
                </button>

                <button
                  type="button"
                  className="danger"
                  onClick={(event) => {
                    event.stopPropagation();
                    onRemove(step.id);
                  }}
                >
                  ×
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
