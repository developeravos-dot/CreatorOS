import { useTranslation } from "../../hooks";
import type { AIStudioWorkflowStep } from "./ai-studio-types";

interface AIWorkflowPipelineProps {
  steps: AIStudioWorkflowStep[];
}

export default function AIWorkflowPipeline({
  steps,
}: AIWorkflowPipelineProps) {
  const { t } = useTranslation();

  return (
    <section className="ai-studio-panel ai-studio-workflow">
      <header className="ai-studio-panel__header">
        <div>
          <span>{t("aiStudio.workflow")}</span>
          <h3>{t("aiStudio.executionPipeline")}</h3>
        </div>

        <span className="ai-studio-live-indicator">
          {t("aiStudio.live")}
        </span>
      </header>

      <div className="ai-studio-workflow__steps">
        {steps
          .sort((left, right) => left.order - right.order)
          .map((step, index) => (
            <div
              className={[
                "ai-studio-workflow-step",
                `ai-studio-workflow-step--${step.status}`,
              ].join(" ")}
              key={step.id}
            >
              <span className="ai-studio-workflow-step__number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div>
                <strong>{step.title}</strong>
                <small>{step.agent}</small>
              </div>

              <span className="ai-studio-workflow-step__status">
                {t(`aiStudio.taskStatus.${step.status}`)}
              </span>
            </div>
          ))}
      </div>
    </section>
  );
}
