import { useMemo, useState } from "react";
import { useTranslation } from "../hooks";
import {
  AIAgentInspector,
  AIAgentsGrid,
  AIApprovalCenter,
  AIControlCenter,
  AIExecutionLogs,
  AITaskQueue,
  AIWorkflowPipeline,
  defaultAIStudioAgents,
  defaultAIStudioTasks,
  defaultApprovals,
  defaultLogs,
  defaultWorkflowSteps,
  type AIStudioAgent,
  type AIStudioApproval,
} from "../features/ai-studio-v2";
import "../features/ai-studio-v2/ai-studio-v2.css";

export default function AIStudioPage() {
  const { t } = useTranslation();

  const [selectedAgent, setSelectedAgent] =
    useState<AIStudioAgent | null>(null);

  const [approvals, setApprovals] =
    useState(defaultApprovals);

  const activeAgents = useMemo(
    () =>
      defaultAIStudioAgents.filter(
        (agent) =>
          agent.status === "active" ||
          agent.status === "running",
      ).length,
    [],
  );

  const runningTasks = useMemo(
    () =>
      defaultAIStudioTasks.filter(
        (task) => task.status === "running",
      ).length,
    [],
  );

  function removeApproval(approval: AIStudioApproval) {
    setApprovals((current) =>
      current.filter((item) => item.id !== approval.id),
    );
  }

  return (
    <div className="ai-studio">
      <header className="ai-studio-page-header">
        <div>
          <span>{t("aiStudio.workspace")}</span>
          <h2>{t("aiStudio.title")}</h2>
          <p>{t("aiStudio.subtitle")}</p>
        </div>

        <div className="ai-studio-page-header__actions">
          <button
            type="button"
            className="ai-studio-button"
          >
            {t("aiStudio.openTemplates")}
          </button>

          <button
            type="button"
            className="ai-studio-button ai-studio-button--primary"
          >
            ＋ {t("aiStudio.createWorkflow")}
          </button>
        </div>
      </header>

      <section className="ai-studio-kpis">
        <article>
          <span>◎</span>
          <div>
            <small>{t("aiStudio.totalAgents")}</small>
            <strong>{defaultAIStudioAgents.length}</strong>
            <p>
              {activeAgents} {t("aiStudio.currentlyActive")}
            </p>
          </div>
        </article>

        <article>
          <span>▶</span>
          <div>
            <small>{t("aiStudio.runningTasks")}</small>
            <strong>{runningTasks}</strong>
            <p>{t("aiStudio.liveExecutions")}</p>
          </div>
        </article>

        <article>
          <span>!</span>
          <div>
            <small>{t("aiStudio.pendingApprovals")}</small>
            <strong>{approvals.length}</strong>
            <p>{t("aiStudio.humanReviewRequired")}</p>
          </div>
        </article>

        <article>
          <span>✓</span>
          <div>
            <small>{t("aiStudio.systemHealth")}</small>
            <strong>98%</strong>
            <p>{t("aiStudio.operational")}</p>
          </div>
        </article>
      </section>

      <AIAgentsGrid
        agents={defaultAIStudioAgents}
        selectedId={selectedAgent?.id ?? null}
        onSelect={setSelectedAgent}
      />

      <section className="ai-studio-grid ai-studio-grid--primary">
        <AIWorkflowPipeline steps={defaultWorkflowSteps} />

        <AITaskQueue
          tasks={defaultAIStudioTasks}
          agents={defaultAIStudioAgents}
        />
      </section>

      <section className="ai-studio-grid ai-studio-grid--secondary">
        <AIApprovalCenter
          approvals={approvals}
          onApprove={removeApproval}
          onReject={removeApproval}
        />

        <AIControlCenter />
      </section>

      <AIExecutionLogs logs={defaultLogs} />

      <AIAgentInspector
        agent={selectedAgent}
        onClose={() => setSelectedAgent(null)}
      />
    </div>
  );
}
