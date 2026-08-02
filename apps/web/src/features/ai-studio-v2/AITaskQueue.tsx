import { useTranslation } from "../../hooks";
import type {
  AIStudioAgent,
  AIStudioTask,
} from "./ai-studio-types";

interface AITaskQueueProps {
  tasks: AIStudioTask[];
  agents: AIStudioAgent[];
}

export default function AITaskQueue({
  tasks,
  agents,
}: AITaskQueueProps) {
  const { t } = useTranslation();

  function getAgentName(agentId: string) {
    return (
      agents.find((agent) => agent.id === agentId)?.name ??
      agentId
    );
  }

  return (
    <section className="ai-studio-panel ai-studio-tasks">
      <header className="ai-studio-panel__header">
        <div>
          <span>{t("aiStudio.taskQueue")}</span>
          <h3>{t("aiStudio.activeExecutions")}</h3>
        </div>

        <strong>{tasks.length}</strong>
      </header>

      <div className="ai-studio-task-list">
        {tasks.map((task) => (
          <article
            className="ai-studio-task"
            key={task.id}
          >
            <header>
              <div>
                <strong>{task.title}</strong>
                <small>
                  {getAgentName(task.agentId)} · {task.createdAt}
                </small>
              </div>

              <span
                className={[
                  "ai-studio-priority",
                  `ai-studio-priority--${task.priority}`,
                ].join(" ")}
              >
                {t(`aiStudio.priority.${task.priority}`)}
              </span>
            </header>

            <div className="ai-studio-task__progress">
              <span style={{ width: `${task.progress}%` }} />
            </div>

            <footer>
              <span>
                {t(`aiStudio.taskStatus.${task.status}`)}
              </span>

              <strong>{task.progress}%</strong>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
