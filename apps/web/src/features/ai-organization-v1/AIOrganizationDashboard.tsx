import {
  useMemo,
  useState,
} from "react";
import type {
  AIRuntimeProvider,
} from "../ai-studio-v2/runtime";
import {
  calculateTeamHealth,
  createAutomaticTeam,
  getAverageWorkload,
  mapRuntimeAgents,
} from "./ai-organization-engine";
import type {
  AIOrganizationApproval,
  AIOrganizationProjectType,
  AIOrganizationState,
  AIOrganizationTaskStatus,
  AIOrganizationTeam,
} from "./ai-organization-types";

import {
  useAIOrganizationPersistence,
} from "./useAIOrganizationPersistence";
import "./ai-organization-v1.css";

interface AIOrganizationDashboardProps {
  runtimeAgents: AIRuntimeProvider[];
  runtimeHealth: number;
}

type OrganizationView =
  | "overview"
  | "capabilities"
  | "tasks"
  | "communication"
  | "memory"
  | "timeline";

const fallbackStorageKey =
  "creatoros.ai-organization.pack-4";

const initialOrganizationState: AIOrganizationState = {
  teams: [],
  selectedTeamId: null,
};
function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("ar-AE", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function AIOrganizationDashboard({
  runtimeAgents,
  runtimeHealth,
}: AIOrganizationDashboardProps) {
  const agents = useMemo(
    () => mapRuntimeAgents(runtimeAgents),
    [runtimeAgents],
  );

  const {
    state,
    setState,
    status: persistenceStatus,
    error: persistenceError,
    version: persistenceVersion,
    reload: reloadPersistence,
  } = useAIOrganizationPersistence({
    workspaceKey: "default",
    fallbackStorageKey,
    initialState: initialOrganizationState,
  });

  const [view, setView] =
    useState<OrganizationView>("overview");

  const [projectType, setProjectType] =
    useState<AIOrganizationProjectType>(
      "youtube",
    );

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] =
    useState("");
  const [taskAgentId, setTaskAgentId] =
    useState("");

  const [message, setMessage] = useState("");
  const [memoryTitle, setMemoryTitle] =
    useState("");
  const [memoryContent, setMemoryContent] =
    useState("");
const selectedTeam =
    state.teams.find(
      (team) => team.id === state.selectedTeamId,
    ) ??
    state.teams[0] ??
    null;

  const selectedTeamHealth = selectedTeam
    ? calculateTeamHealth(selectedTeam, agents)
    : 0;

  const selectedTeamWorkload = selectedTeam
    ? getAverageWorkload(selectedTeam)
    : 0;

  function replaceTeam(
    teamId: string,
    update: (
      team: AIOrganizationTeam,
    ) => AIOrganizationTeam,
  ) {
    setState((current) => ({
      ...current,
      teams: current.teams.map((team) =>
        team.id === teamId
          ? update(team)
          : team,
      ),
    }));
  }

  function createTeam() {
    const team = createAutomaticTeam(
      agents,
      projectType,
    );

    setState((current) => ({
      teams: [team, ...current.teams],
      selectedTeamId: team.id,
    }));

    setView("overview");
  }

  function assignTask() {
    if (!selectedTeam || !taskTitle.trim()) {
      return;
    }

    const now = new Date().toISOString();
    const assignedAgentId =
      taskAgentId || null;

    replaceTeam(selectedTeam.id, (team) => ({
      ...team,
      tasks: [
        {
          id: createId("task"),
          title: taskTitle.trim(),
          description: taskDescription.trim(),
          assignedAgentId,
          status: assignedAgentId
            ? "assigned"
            : "backlog",
          priority: "medium",
          createdAt: now,
          updatedAt: now,
        },
        ...team.tasks,
      ],
      members: team.members.map((member) =>
        member.agentId === assignedAgentId
          ? {
              ...member,
              workload: Math.min(
                100,
                member.workload + 15,
              ),
            }
          : member,
      ),
      timeline: [
        {
          id: createId("event"),
          type: "task-created",
          title: "تم إنشاء مهمة",
          description: taskTitle.trim(),
          createdAt: now,
        },
        ...team.timeline,
      ],
      updatedAt: now,
    }));

    setTaskTitle("");
    setTaskDescription("");
    setTaskAgentId("");
  }

  function updateTaskStatus(
    taskId: string,
    status: AIOrganizationTaskStatus,
  ) {
    if (!selectedTeam) {
      return;
    }

    const now = new Date().toISOString();

    replaceTeam(selectedTeam.id, (team) => ({
      ...team,
      tasks: team.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status,
              updatedAt: now,
            }
          : task,
      ),
      timeline: [
        {
          id: createId("event"),
          type: "task-updated",
          title: "تم تحديث حالة مهمة",
          description: status,
          createdAt: now,
        },
        ...team.timeline,
      ],
      updatedAt: now,
    }));
  }

  function sendMessage() {
    if (!selectedTeam || !message.trim()) {
      return;
    }

    const now = new Date().toISOString();
    const leader =
      selectedTeam.members.find(
        (member) => member.isLeader,
      );

    replaceTeam(selectedTeam.id, (team) => ({
      ...team,
      messages: [
        {
          id: createId("message"),
          agentId: leader?.agentId ?? null,
          content: message.trim(),
          createdAt: now,
        },
        ...team.messages,
      ],
      timeline: [
        {
          id: createId("event"),
          type: "message",
          title: "رسالة بين الوكلاء",
          description: message.trim(),
          createdAt: now,
        },
        ...team.timeline,
      ],
      updatedAt: now,
    }));

    setMessage("");
  }

  function addMemory() {
    if (
      !selectedTeam ||
      !memoryTitle.trim() ||
      !memoryContent.trim()
    ) {
      return;
    }

    const now = new Date().toISOString();

    replaceTeam(selectedTeam.id, (team) => ({
      ...team,
      memory: [
        {
          id: createId("memory"),
          title: memoryTitle.trim(),
          content: memoryContent.trim(),
          createdAt: now,
        },
        ...team.memory,
      ],
      timeline: [
        {
          id: createId("event"),
          type: "memory",
          title: "تم تحديث ذاكرة الفريق",
          description: memoryTitle.trim(),
          createdAt: now,
        },
        ...team.timeline,
      ],
      updatedAt: now,
    }));

    setMemoryTitle("");
    setMemoryContent("");
  }

  function decideApproval(
    approval: AIOrganizationApproval,
    status: "approved" | "rejected",
  ) {
    if (!selectedTeam) {
      return;
    }

    const now = new Date().toISOString();

    replaceTeam(selectedTeam.id, (team) => ({
      ...team,
      approvals: team.approvals.map(
        (item) =>
          item.id === approval.id
            ? {
                ...item,
                status,
                decidedAt: now,
              }
            : item,
      ),
      timeline: [
        {
          id: createId("event"),
          type: "approval",
          title:
            status === "approved"
              ? "تم الاعتماد البشري"
              : "تم رفض الطلب",
          description: approval.title,
          createdAt: now,
        },
        ...team.timeline,
      ],
      updatedAt: now,
    }));
  }

  return (
    <section className="ai-organization">
      <header className="ai-organization__header">
        <div>
          <span>CREATOROS AI ORGANIZATION</span>
          <h2>منظمة فرق الوكلاء الذكية</h2>
          <p>
            إنشاء وإدارة فرق وكلاء مرتبطة مباشرة
            بمزودي Runtime الحقيقيين مع الاحتفاظ
            بالسلطة النهائية للإنسان.
          </p>
        </div>

        <div className="ai-organization__runtime">
          <span
            className={
              runtimeHealth >= 90
                ? "online"
                : "degraded"
            }
          />

          <div>
            <strong>
              Runtime Health {runtimeHealth}%
            </strong>
            <small>
              {agents.length} وكيل متاح للتكوين
            </small>
          </div>
        </div>
      </header>

      <section className="ai-organization__persistence">
        <div className="ai-organization__persistence-main">
          <span
            className={`ai-organization__persistence-dot ai-organization__persistence-dot--${persistenceStatus}`}
          />

          <div>
            <strong>
              {persistenceStatus === "loading"
                ? "جارٍ تحميل بيانات المنظمة"
                : persistenceStatus === "saving"
                  ? "جارٍ الحفظ في PostgreSQL"
                  : persistenceStatus === "saved"
                    ? "محفوظ في PostgreSQL"
                    : persistenceStatus === "ready"
                      ? "متصل بقاعدة البيانات"
                      : "تعذر الاتصال بقاعدة البيانات"}
            </strong>

            <small>
              {persistenceVersion !== null
                ? `نسخة البيانات ${persistenceVersion}`
                : "بانتظار النسخة الأولى"}
            </small>
          </div>
        </div>

        {persistenceError ? (
          <div className="ai-organization__persistence-error">
            <span>{persistenceError}</span>

            <button
              type="button"
              onClick={() => {
                void reloadPersistence();
              }}
            >
              إعادة التحميل
            </button>
          </div>
        ) : null}
      </section>

      <section className="ai-organization__kpis">
        <article>
          <span>◉</span>
          <div>
            <small>فرق الوكلاء</small>
            <strong>{state.teams.length}</strong>
          </div>
        </article>

        <article>
          <span>◎</span>
          <div>
            <small>وكلاء Runtime</small>
            <strong>{agents.length}</strong>
          </div>
        </article>

        <article>
          <span>✓</span>
          <div>
            <small>صحة الفريق</small>
            <strong>
              {selectedTeamHealth}%
            </strong>
          </div>
        </article>

        <article>
          <span>◫</span>
          <div>
            <small>متوسط عبء العمل</small>
            <strong>
              {selectedTeamWorkload}%
            </strong>
          </div>
        </article>
      </section>

      <section className="ai-organization__builder">
        <div>
          <span>TEAM FACTORY</span>
          <h3>إنشاء فريق تلقائي</h3>
          <p>
            يختار النظام قائدًا ووكلاء متخصصين
            وفق نوع المشروع وقدرات Runtime.
          </p>
        </div>

        <select
          value={projectType}
          onChange={(event) =>
            setProjectType(
              event.target
                .value as AIOrganizationProjectType,
            )
          }
        >
          <option value="youtube">
            إنتاج YouTube
          </option>
          <option value="tiktok">
            إنتاج TikTok
          </option>
          <option value="instagram">
            إنتاج Instagram
          </option>
          <option value="campaign">
            حملة تسويقية
          </option>
          <option value="research">
            بحث وذكاء
          </option>
          <option value="general">
            مشروع عام
          </option>
        </select>

        <button
          type="button"
          onClick={createTeam}
        >
          ✦ إنشاء الفريق الذكي
        </button>
      </section>

      {state.teams.length > 0 ? (
        <nav className="ai-organization__teams">
          {state.teams.map((team) => (
            <button
              type="button"
              key={team.id}
              className={
                selectedTeam?.id === team.id
                  ? "active"
                  : ""
              }
              onClick={() =>
                setState((current) => ({
                  ...current,
                  selectedTeamId: team.id,
                }))
              }
            >
              <strong>{team.name}</strong>
              <small>
                {team.members.length} وكلاء
              </small>
            </button>
          ))}
        </nav>
      ) : null}

      {!selectedTeam ? (
        <div className="ai-organization__empty">
          <span>◎</span>
          <h3>لا توجد فرق حتى الآن</h3>
          <p>
            اختر نوع المشروع ثم أنشئ أول فريق
            وكلاء ذكي.
          </p>
        </div>
      ) : (
        <>
          <header className="ai-organization__team-header">
            <div>
              <span>ACTIVE AI TEAM</span>
              <h3>{selectedTeam.name}</h3>
              <p>{selectedTeam.objective}</p>
            </div>

            <div className="ai-organization__health">
              <strong>
                {selectedTeamHealth}%
              </strong>
              <span>Team Health</span>
            </div>
          </header>

          <nav className="ai-organization__views">
            {[
              ["overview", "نظرة عامة"],
              ["capabilities", "مصفوفة القدرات"],
              ["tasks", "توزيع المهام"],
              ["communication", "اتصال الوكلاء"],
              ["memory", "ذاكرة الفريق"],
              ["timeline", "خط التنفيذ"],
            ].map(([id, label]) => (
              <button
                type="button"
                key={id}
                className={
                  view === id ? "active" : ""
                }
                onClick={() =>
                  setView(id as OrganizationView)
                }
              >
                {label}
              </button>
            ))}
          </nav>

          {view === "overview" ? (
            <section className="ai-organization__overview">
              <article className="ai-organization__members">
                <header>
                  <span>TEAM STRUCTURE</span>
                  <h4>قائد الفريق والوكلاء</h4>
                </header>

                <div>
                  {selectedTeam.members.map(
                    (member) => {
                      const agent = agents.find(
                        (item) =>
                          item.id === member.agentId,
                      );

                      return (
                        <section
                          key={member.agentId}
                          className={
                            member.isLeader
                              ? "leader"
                              : ""
                          }
                        >
                          <span>
                            {agent?.icon ?? "◎"}
                          </span>

                          <div>
                            <strong>
                              {agent?.displayName ??
                                member.agentId}
                            </strong>
                            <small>
                              {member.role}
                            </small>
                          </div>

                          <b>
                            {member.workload}%
                          </b>
                        </section>
                      );
                    },
                  )}
                </div>
              </article>

              <article className="ai-organization__authority">
                <header>
                  <span>HUMAN FINAL AUTHORITY</span>
                  <h4>مركز الاعتمادات البشرية</h4>
                </header>

                {selectedTeam.approvals.length ===
                0 ? (
                  <p>لا توجد طلبات اعتماد.</p>
                ) : (
                  selectedTeam.approvals.map(
                    (approval) => (
                      <section key={approval.id}>
                        <div>
                          <strong>
                            {approval.title}
                          </strong>
                          <small>
                            {approval.description}
                          </small>
                        </div>

                        {approval.status ===
                        "pending" ? (
                          <div>
                            <button
                              type="button"
                              className="approve"
                              onClick={() =>
                                decideApproval(
                                  approval,
                                  "approved",
                                )
                              }
                            >
                              اعتماد
                            </button>

                            <button
                              type="button"
                              className="reject"
                              onClick={() =>
                                decideApproval(
                                  approval,
                                  "rejected",
                                )
                              }
                            >
                              رفض
                            </button>
                          </div>
                        ) : (
                          <b>
                            {approval.status ===
                            "approved"
                              ? "تم الاعتماد"
                              : "مرفوض"}
                          </b>
                        )}
                      </section>
                    ),
                  )
                )}
              </article>
            </section>
          ) : null}

          {view === "capabilities" ? (
            <section className="ai-organization__matrix">
              <header>
                <span>AGENT CAPABILITY MATRIX</span>
                <h4>مصفوفة قدرات الفريق</h4>
              </header>

              <div>
                {selectedTeam.members.map(
                  (member) => {
                    const agent = agents.find(
                      (item) =>
                        item.id === member.agentId,
                    );

                    return (
                      <article key={member.agentId}>
                        <div>
                          <span>
                            {agent?.icon ?? "◎"}
                          </span>

                          <section>
                            <strong>
                              {agent?.displayName ??
                                member.agentId}
                            </strong>
                            <small>
                              {member.role}
                            </small>
                          </section>
                        </div>

                        <p>
                          {agent?.module}
                        </p>

                        <section>
                          {agent?.tags.map((tag) => (
                            <span key={tag}>
                              {tag}
                            </span>
                          ))}
                        </section>

                        <footer>
                          <span>
                            {agent?.available
                              ? "متاح"
                              : "غير متاح"}
                          </span>
                          <b>
                            عبء العمل{" "}
                            {member.workload}%
                          </b>
                        </footer>
                      </article>
                    );
                  },
                )}
              </div>
            </section>
          ) : null}

          {view === "tasks" ? (
            <section className="ai-organization__tasks">
              <div className="ai-organization__task-form">
                <header>
                  <span>TASK ASSIGNMENT</span>
                  <h4>إنشاء وتوزيع مهمة</h4>
                </header>

                <input
                  value={taskTitle}
                  placeholder="عنوان المهمة"
                  onChange={(event) =>
                    setTaskTitle(
                      event.target.value,
                    )
                  }
                />

                <textarea
                  value={taskDescription}
                  placeholder="وصف المهمة"
                  onChange={(event) =>
                    setTaskDescription(
                      event.target.value,
                    )
                  }
                />

                <select
                  value={taskAgentId}
                  onChange={(event) =>
                    setTaskAgentId(
                      event.target.value,
                    )
                  }
                >
                  <option value="">
                    بدون تعيين
                  </option>

                  {selectedTeam.members.map(
                    (member) => {
                      const agent = agents.find(
                        (item) =>
                          item.id ===
                          member.agentId,
                      );

                      return (
                        <option
                          value={member.agentId}
                          key={member.agentId}
                        >
                          {agent?.displayName ??
                            member.agentId}{" "}
                          — {member.role}
                        </option>
                      );
                    },
                  )}
                </select>

                <button
                  type="button"
                  onClick={assignTask}
                >
                  ＋ إضافة المهمة
                </button>
              </div>

              <div className="ai-organization__task-list">
                {selectedTeam.tasks.length ===
                0 ? (
                  <div className="empty">
                    لا توجد مهام بعد.
                  </div>
                ) : (
                  selectedTeam.tasks.map(
                    (task) => (
                      <article key={task.id}>
                        <div>
                          <strong>
                            {task.title}
                          </strong>
                          <p>
                            {task.description ||
                              "بدون وصف"}
                          </p>
                        </div>

                        <select
                          value={task.status}
                          onChange={(event) =>
                            updateTaskStatus(
                              task.id,
                              event.target
                                .value as AIOrganizationTaskStatus,
                            )
                          }
                        >
                          <option value="backlog">
                            قائمة الانتظار
                          </option>
                          <option value="assigned">
                            تم التعيين
                          </option>
                          <option value="running">
                            قيد التنفيذ
                          </option>
                          <option value="review">
                            مراجعة
                          </option>
                          <option value="completed">
                            مكتمل
                          </option>
                          <option value="blocked">
                            متوقف
                          </option>
                        </select>
                      </article>
                    ),
                  )
                )}
              </div>
            </section>
          ) : null}

          {view === "communication" ? (
            <section className="ai-organization__communication">
              <header>
                <span>INTER-AGENT COMMUNICATION</span>
                <h4>قناة اتصال الفريق</h4>
              </header>

              <div className="ai-organization__message-form">
                <textarea
                  value={message}
                  placeholder="أرسل توجيهًا أو رسالة إلى الفريق..."
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                />

                <button
                  type="button"
                  onClick={sendMessage}
                >
                  إرسال
                </button>
              </div>

              <div className="ai-organization__messages">
                {selectedTeam.messages.length ===
                0 ? (
                  <p>لا توجد رسائل بعد.</p>
                ) : (
                  selectedTeam.messages.map(
                    (item) => (
                      <article key={item.id}>
                        <span>◎</span>
                        <div>
                          <p>{item.content}</p>
                          <small>
                            {formatDate(
                              item.createdAt,
                            )}
                          </small>
                        </div>
                      </article>
                    ),
                  )
                )}
              </div>
            </section>
          ) : null}

          {view === "memory" ? (
            <section className="ai-organization__memory">
              <div>
                <header>
                  <span>SHARED TEAM MEMORY</span>
                  <h4>إضافة معرفة مشتركة</h4>
                </header>

                <input
                  value={memoryTitle}
                  placeholder="عنوان المعرفة"
                  onChange={(event) =>
                    setMemoryTitle(
                      event.target.value,
                    )
                  }
                />

                <textarea
                  value={memoryContent}
                  placeholder="المعلومة أو القرار أو السياق..."
                  onChange={(event) =>
                    setMemoryContent(
                      event.target.value,
                    )
                  }
                />

                <button
                  type="button"
                  onClick={addMemory}
                >
                  حفظ في ذاكرة الفريق
                </button>
              </div>

              <div>
                {selectedTeam.memory.length ===
                0 ? (
                  <p>ذاكرة الفريق فارغة.</p>
                ) : (
                  selectedTeam.memory.map(
                    (entry) => (
                      <article key={entry.id}>
                        <strong>
                          {entry.title}
                        </strong>
                        <p>{entry.content}</p>
                        <small>
                          {formatDate(
                            entry.createdAt,
                          )}
                        </small>
                      </article>
                    ),
                  )
                )}
              </div>
            </section>
          ) : null}

          {view === "timeline" ? (
            <section className="ai-organization__timeline">
              <header>
                <span>TEAM EXECUTION TIMELINE</span>
                <h4>الخط الزمني للتنفيذ</h4>
              </header>

              {selectedTeam.timeline.map(
                (event) => (
                  <article key={event.id}>
                    <span />
                    <div>
                      <strong>
                        {event.title}
                      </strong>
                      <p>
                        {event.description}
                      </p>
                      <small>
                        {formatDate(
                          event.createdAt,
                        )}
                      </small>
                    </div>
                  </article>
                ),
              )}
            </section>
          ) : null}
        </>
      )}
    </section>
  );
}
