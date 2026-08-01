import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

export type AgentStatus =
  | 'idle'
  | 'assigned'
  | 'working'
  | 'waiting'
  | 'blocked'
  | 'human-review'
  | 'completed'
  | 'disabled';

export type AgentRole =
  | 'researcher'
  | 'strategist'
  | 'writer'
  | 'producer'
  | 'editor'
  | 'publisher'
  | 'growth'
  | 'monetization'
  | 'ip-specialist'
  | 'compliance'
  | 'analyst'
  | 'coordinator'
  | 'custom';

export type TaskStatus =
  | 'backlog'
  | 'assigned'
  | 'working'
  | 'blocked'
  | 'human-review'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'cancelled';

export type TaskPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export interface MediaAgent {
  id: string;
  name: string;
  role: AgentRole;
  specialization: string;
  status: AgentStatus;
  capabilities: string[];
  tools: string[];
  assignedTaskIds: string[];
  completedTaskIds: string[];
  memoryKeys: string[];
  qualityScore: number;
  reliabilityScore: number;
  collaborationScore: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MediaAgentTask {
  id: string;
  title: string;
  description: string;
  projectId: string;
  contentId: string;
  workflowId: string;
  assignedAgentIds: string[];
  dependencies: string[];
  deliverables: string[];
  status: TaskStatus;
  priority: TaskPriority;
  progress: number;
  result: Record<string, unknown>;
  risks: string[];
  blockers: string[];
  humanApprovalRequired: boolean;
  humanApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MediaWorkflow {
  id: string;
  name: string;
  description: string;
  projectId: string;
  taskIds: string[];
  agentIds: string[];
  status:
    | 'draft'
    | 'planning'
    | 'running'
    | 'paused'
    | 'human-review'
    | 'approved'
    | 'completed'
    | 'cancelled';
  progress: number;
  currentStage: string;
  humanApprovalRequired: boolean;
  humanApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SharedMemoryEntry {
  id: string;
  key: string;
  namespace: string;
  value: unknown;
  sourceAgentId: string;
  projectId: string;
  version: number;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationDecision {
  id: string;
  title: string;
  recommendation: string;
  rationale: string;
  proposedByAgentIds: string[];
  supportingTaskIds: string[];
  confidence: number;
  expectedImpact: number;
  status:
    | 'proposed'
    | 'human-review'
    | 'approved'
    | 'rejected'
    | 'executed';
  humanApproved: boolean;
  decidedBy: string;
  decidedAt: string;
  createdAt: string;
}

export abstract class MediaAiOrganizationEngineBase {
  private readonly agents =
    new Map<string, MediaAgent>();

  private readonly tasks =
    new Map<string, MediaAgentTask>();

  private readonly workflows =
    new Map<string, MediaWorkflow>();

  private readonly memory =
    new Map<string, SharedMemoryEntry>();

  private readonly decisions =
    new Map<string, OrganizationDecision>();

  protected constructor(
    private readonly engineName: string,
  ) {}

  getDashboard() {
    const agents = [...this.agents.values()];
    const tasks = [...this.tasks.values()];
    const workflows = [...this.workflows.values()];
    const decisions = [...this.decisions.values()];

    return {
      engine: this.engineName,
      version: '1.0.0',
      status: 'operational' as const,
      architecture:
        'AVOS Media AI Digital Organization',
      humanFinalAuthority: true,

      totalAgents: agents.length,
      enabledAgents: agents.filter(
        (agent) => agent.enabled,
      ).length,
      workingAgents: agents.filter(
        (agent) => agent.status === 'working',
      ).length,

      totalTasks: tasks.length,
      workingTasks: tasks.filter(
        (task) => task.status === 'working',
      ).length,
      blockedTasks: tasks.filter(
        (task) => task.status === 'blocked',
      ).length,
      pendingTaskApprovals: tasks.filter(
        (task) =>
          task.humanApprovalRequired &&
          !task.humanApproved,
      ).length,

      totalWorkflows: workflows.length,
      runningWorkflows: workflows.filter(
        (workflow) =>
          workflow.status === 'running',
      ).length,

      sharedMemoryEntries: this.memory.size,

      totalDecisions: decisions.length,
      pendingDecisions: decisions.filter(
        (decision) =>
          decision.status === 'human-review',
      ).length,

      averageAgentQuality: this.average(
        agents.map((agent) => agent.qualityScore),
      ),

      averageTaskProgress: this.average(
        tasks.map((task) => task.progress),
      ),

      updatedAt: new Date().toISOString(),
    };
  }

  createAgent(input: {
    name: string;
    role?: AgentRole;
    specialization?: string;
    capabilities?: string[];
    tools?: string[];
    qualityScore?: number;
    reliabilityScore?: number;
    collaborationScore?: number;
  }) {
    const name = input.name?.trim();

    if (!name) {
      throw new BadRequestException(
        'Agent name is required',
      );
    }

    const now = new Date().toISOString();

    const agent: MediaAgent = {
      id: randomUUID(),
      name,
      role: input.role ?? 'custom',
      specialization:
        input.specialization?.trim() ?? '',
      status: 'idle',
      capabilities: this.normalizeList(
        input.capabilities,
      ),
      tools: this.normalizeList(input.tools),
      assignedTaskIds: [],
      completedTaskIds: [],
      memoryKeys: [],
      qualityScore: this.score(
        input.qualityScore ?? 0,
      ),
      reliabilityScore: this.score(
        input.reliabilityScore ?? 0,
      ),
      collaborationScore: this.score(
        input.collaborationScore ?? 0,
      ),
      enabled: true,
      createdAt: now,
      updatedAt: now,
    };

    this.agents.set(agent.id, agent);

    return agent;
  }

  listAgents(filters?: {
    role?: AgentRole;
    status?: AgentStatus;
    enabled?: boolean;
    search?: string;
  }) {
    const search =
      filters?.search?.trim().toLowerCase();

    return [...this.agents.values()]
      .filter((agent) => {
        if (
          filters?.role &&
          agent.role !== filters.role
        ) {
          return false;
        }

        if (
          filters?.status &&
          agent.status !== filters.status
        ) {
          return false;
        }

        if (
          filters?.enabled !== undefined &&
          agent.enabled !== filters.enabled
        ) {
          return false;
        }

        if (search) {
          const searchable = [
            agent.name,
            agent.role,
            agent.specialization,
            ...agent.capabilities,
            ...agent.tools,
          ]
            .join(' ')
            .toLowerCase();

          if (!searchable.includes(search)) {
            return false;
          }
        }

        return true;
      })
      .sort(
        (first, second) =>
          second.qualityScore -
          first.qualityScore,
      );
  }

  getAgent(id: string) {
    const agent = this.agents.get(id);

    if (!agent) {
      throw new NotFoundException(
        `Agent '${id}' was not found`,
      );
    }

    return agent;
  }

  updateAgent(
    id: string,
    input: Partial<MediaAgent>,
  ) {
    const current = this.getAgent(id);

    const updated: MediaAgent = {
      ...current,
      ...input,
      id: current.id,
      name:
        input.name?.trim() ?? current.name,
      specialization:
        input.specialization?.trim() ??
        current.specialization,
      capabilities:
        input.capabilities !== undefined
          ? this.normalizeList(
              input.capabilities,
            )
          : current.capabilities,
      tools:
        input.tools !== undefined
          ? this.normalizeList(input.tools)
          : current.tools,
      qualityScore:
        input.qualityScore !== undefined
          ? this.score(input.qualityScore)
          : current.qualityScore,
      reliabilityScore:
        input.reliabilityScore !== undefined
          ? this.score(input.reliabilityScore)
          : current.reliabilityScore,
      collaborationScore:
        input.collaborationScore !== undefined
          ? this.score(
              input.collaborationScore,
            )
          : current.collaborationScore,
      updatedAt: new Date().toISOString(),
    };

    this.agents.set(id, updated);

    return updated;
  }

  disableAgent(id: string) {
    return this.updateAgent(id, {
      enabled: false,
      status: 'disabled',
    });
  }

  enableAgent(id: string) {
    return this.updateAgent(id, {
      enabled: true,
      status: 'idle',
    });
  }

  createTask(input: {
    title: string;
    description?: string;
    projectId?: string;
    contentId?: string;
    workflowId?: string;
    priority?: TaskPriority;
    assignedAgentIds?: string[];
    dependencies?: string[];
    deliverables?: string[];
    humanApprovalRequired?: boolean;
  }) {
    const title = input.title?.trim();

    if (!title) {
      throw new BadRequestException(
        'Task title is required',
      );
    }

    const agentIds =
      input.assignedAgentIds ?? [];

    agentIds.forEach((agentId) =>
      this.getAgent(agentId),
    );

    const now = new Date().toISOString();

    const task: MediaAgentTask = {
      id: randomUUID(),
      title,
      description:
        input.description?.trim() ?? '',
      projectId:
        input.projectId?.trim() ?? '',
      contentId:
        input.contentId?.trim() ?? '',
      workflowId:
        input.workflowId?.trim() ?? '',
      assignedAgentIds: [...new Set(agentIds)],
      dependencies: this.normalizeList(
        input.dependencies,
        false,
      ),
      deliverables: this.normalizeList(
        input.deliverables,
        false,
      ),
      status:
        agentIds.length > 0
          ? 'assigned'
          : 'backlog',
      priority: input.priority ?? 'medium',
      progress: 0,
      result: {},
      risks: [],
      blockers: [],
      humanApprovalRequired:
        input.humanApprovalRequired ?? true,
      humanApproved: false,
      createdAt: now,
      updatedAt: now,
    };

    this.tasks.set(task.id, task);

    agentIds.forEach((agentId) => {
      const agent = this.getAgent(agentId);

      this.updateAgent(agentId, {
        assignedTaskIds: [
          ...new Set([
            ...agent.assignedTaskIds,
            task.id,
          ]),
        ],
        status: 'assigned',
      });
    });

    return task;
  }

  listTasks(filters?: {
    status?: TaskStatus;
    priority?: TaskPriority;
    projectId?: string;
    agentId?: string;
    search?: string;
  }) {
    const search =
      filters?.search?.trim().toLowerCase();

    return [...this.tasks.values()]
      .filter((task) => {
        if (
          filters?.status &&
          task.status !== filters.status
        ) {
          return false;
        }

        if (
          filters?.priority &&
          task.priority !== filters.priority
        ) {
          return false;
        }

        if (
          filters?.projectId &&
          task.projectId !== filters.projectId
        ) {
          return false;
        }

        if (
          filters?.agentId &&
          !task.assignedAgentIds.includes(
            filters.agentId,
          )
        ) {
          return false;
        }

        if (
          search &&
          !`${task.title} ${task.description}`
            .toLowerCase()
            .includes(search)
        ) {
          return false;
        }

        return true;
      });
  }

  getTask(id: string) {
    const task = this.tasks.get(id);

    if (!task) {
      throw new NotFoundException(
        `Task '${id}' was not found`,
      );
    }

    return task;
  }

  updateTask(
    id: string,
    input: Partial<MediaAgentTask>,
  ) {
    const current = this.getTask(id);

    const updated: MediaAgentTask = {
      ...current,
      ...input,
      id: current.id,
      title:
        input.title?.trim() ?? current.title,
      description:
        input.description?.trim() ??
        current.description,
      progress:
        input.progress !== undefined
          ? this.score(input.progress)
          : current.progress,
      assignedAgentIds:
        input.assignedAgentIds !== undefined
          ? [...new Set(input.assignedAgentIds)]
          : current.assignedAgentIds,
      dependencies:
        input.dependencies !== undefined
          ? this.normalizeList(
              input.dependencies,
              false,
            )
          : current.dependencies,
      deliverables:
        input.deliverables !== undefined
          ? this.normalizeList(
              input.deliverables,
              false,
            )
          : current.deliverables,
      risks:
        input.risks !== undefined
          ? this.normalizeList(
              input.risks,
              false,
            )
          : current.risks,
      blockers:
        input.blockers !== undefined
          ? this.normalizeList(
              input.blockers,
              false,
            )
          : current.blockers,
      updatedAt: new Date().toISOString(),
    };

    this.tasks.set(id, updated);

    return updated;
  }

  assignAgents(
    taskId: string,
    agentIds: string[],
  ) {
    const task = this.getTask(taskId);

    agentIds.forEach((agentId) =>
      this.getAgent(agentId),
    );

    const assignedAgentIds = [
      ...new Set([
        ...task.assignedAgentIds,
        ...agentIds,
      ]),
    ];

    agentIds.forEach((agentId) => {
      const agent = this.getAgent(agentId);

      this.updateAgent(agentId, {
        assignedTaskIds: [
          ...new Set([
            ...agent.assignedTaskIds,
            taskId,
          ]),
        ],
        status: 'assigned',
      });
    });

    return this.updateTask(taskId, {
      assignedAgentIds,
      status: 'assigned',
    });
  }

  startTask(id: string) {
    const task = this.getTask(id);

    if (task.assignedAgentIds.length === 0) {
      throw new BadRequestException(
        'Task must have at least one assigned agent',
      );
    }

    task.assignedAgentIds.forEach((agentId) =>
      this.updateAgent(agentId, {
        status: 'working',
      }),
    );

    return this.updateTask(id, {
      status: 'working',
    });
  }

  blockTask(id: string, blocker: string) {
    const task = this.getTask(id);

    return this.updateTask(id, {
      status: 'blocked',
      blockers: [
        ...new Set([
          ...task.blockers,
          blocker.trim(),
        ]),
      ].filter(Boolean),
    });
  }

  submitTaskForHumanReview(id: string) {
    const task = this.getTask(id);

    task.assignedAgentIds.forEach((agentId) =>
      this.updateAgent(agentId, {
        status: 'human-review',
      }),
    );

    return this.updateTask(id, {
      status: 'human-review',
      progress: 100,
    });
  }

  approveTask(id: string) {
    const task = this.getTask(id);

    task.assignedAgentIds.forEach((agentId) => {
      const agent = this.getAgent(agentId);

      this.updateAgent(agentId, {
        status: 'completed',
        completedTaskIds: [
          ...new Set([
            ...agent.completedTaskIds,
            id,
          ]),
        ],
      });
    });

    return this.updateTask(id, {
      status: 'approved',
      progress: 100,
      humanApproved: true,
    });
  }

  rejectTask(id: string) {
    return this.updateTask(id, {
      status: 'rejected',
      humanApproved: false,
    });
  }

  completeTask(id: string) {
    const task = this.getTask(id);

    if (
      task.humanApprovalRequired &&
      !task.humanApproved
    ) {
      throw new BadRequestException(
        'Human approval is required before task completion',
      );
    }

    return this.updateTask(id, {
      status: 'completed',
      progress: 100,
    });
  }

  createWorkflow(input: {
    name: string;
    description?: string;
    projectId?: string;
    taskIds?: string[];
    agentIds?: string[];
    humanApprovalRequired?: boolean;
  }) {
    const name = input.name?.trim();

    if (!name) {
      throw new BadRequestException(
        'Workflow name is required',
      );
    }

    const taskIds = input.taskIds ?? [];
    const agentIds = input.agentIds ?? [];

    taskIds.forEach((taskId) =>
      this.getTask(taskId),
    );

    agentIds.forEach((agentId) =>
      this.getAgent(agentId),
    );

    const now = new Date().toISOString();

    const workflow: MediaWorkflow = {
      id: randomUUID(),
      name,
      description:
        input.description?.trim() ?? '',
      projectId:
        input.projectId?.trim() ?? '',
      taskIds: [...new Set(taskIds)],
      agentIds: [...new Set(agentIds)],
      status: 'draft',
      progress: 0,
      currentStage: 'created',
      humanApprovalRequired:
        input.humanApprovalRequired ?? true,
      humanApproved: false,
      createdAt: now,
      updatedAt: now,
    };

    this.workflows.set(workflow.id, workflow);

    return workflow;
  }

  listWorkflows() {
    return [...this.workflows.values()];
  }

  getWorkflow(id: string) {
    const workflow = this.workflows.get(id);

    if (!workflow) {
      throw new NotFoundException(
        `Workflow '${id}' was not found`,
      );
    }

    return workflow;
  }

  updateWorkflow(
    id: string,
    input: Partial<MediaWorkflow>,
  ) {
    const current = this.getWorkflow(id);

    const updated: MediaWorkflow = {
      ...current,
      ...input,
      id: current.id,
      name:
        input.name?.trim() ?? current.name,
      description:
        input.description?.trim() ??
        current.description,
      progress:
        input.progress !== undefined
          ? this.score(input.progress)
          : current.progress,
      taskIds:
        input.taskIds !== undefined
          ? [...new Set(input.taskIds)]
          : current.taskIds,
      agentIds:
        input.agentIds !== undefined
          ? [...new Set(input.agentIds)]
          : current.agentIds,
      updatedAt: new Date().toISOString(),
    };

    this.workflows.set(id, updated);

    return updated;
  }

  startWorkflow(id: string) {
    const workflow = this.getWorkflow(id);

    if (workflow.taskIds.length === 0) {
      throw new BadRequestException(
        'Workflow must contain tasks',
      );
    }

    return this.updateWorkflow(id, {
      status: 'running',
      currentStage: 'execution',
    });
  }

  pauseWorkflow(id: string) {
    return this.updateWorkflow(id, {
      status: 'paused',
    });
  }

  submitWorkflowForHumanReview(id: string) {
    return this.updateWorkflow(id, {
      status: 'human-review',
      currentStage: 'human-review',
    });
  }

  approveWorkflow(id: string) {
    return this.updateWorkflow(id, {
      status: 'approved',
      humanApproved: true,
    });
  }

  completeWorkflow(id: string) {
    const workflow = this.getWorkflow(id);

    if (
      workflow.humanApprovalRequired &&
      !workflow.humanApproved
    ) {
      throw new BadRequestException(
        'Human approval is required before workflow completion',
      );
    }

    return this.updateWorkflow(id, {
      status: 'completed',
      progress: 100,
      currentStage: 'completed',
    });
  }

  writeMemory(input: {
    key: string;
    namespace?: string;
    value: unknown;
    sourceAgentId?: string;
    projectId?: string;
    approved?: boolean;
  }) {
    const key = input.key?.trim();

    if (!key) {
      throw new BadRequestException(
        'Memory key is required',
      );
    }

    if (input.sourceAgentId) {
      this.getAgent(input.sourceAgentId);
    }

    const existing = [...this.memory.values()]
      .find(
        (entry) =>
          entry.key === key &&
          entry.namespace ===
            (input.namespace?.trim() ??
              'global'),
      );

    const now = new Date().toISOString();

    const entry: SharedMemoryEntry = {
      id: existing?.id ?? randomUUID(),
      key,
      namespace:
        input.namespace?.trim() ?? 'global',
      value: input.value,
      sourceAgentId:
        input.sourceAgentId?.trim() ?? '',
      projectId:
        input.projectId?.trim() ?? '',
      version: (existing?.version ?? 0) + 1,
      approved: input.approved ?? false,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.memory.set(entry.id, entry);

    if (entry.sourceAgentId) {
      const agent = this.getAgent(
        entry.sourceAgentId,
      );

      this.updateAgent(agent.id, {
        memoryKeys: [
          ...new Set([
            ...agent.memoryKeys,
            entry.key,
          ]),
        ],
      });
    }

    return entry;
  }

  listMemory(namespace?: string) {
    return [...this.memory.values()].filter(
      (entry) =>
        !namespace ||
        entry.namespace === namespace,
    );
  }

  approveMemory(id: string) {
    const entry = this.memory.get(id);

    if (!entry) {
      throw new NotFoundException(
        `Memory entry '${id}' was not found`,
      );
    }

    const updated = {
      ...entry,
      approved: true,
      updatedAt: new Date().toISOString(),
    };

    this.memory.set(id, updated);

    return updated;
  }

  createDecision(input: {
    title: string;
    recommendation?: string;
    rationale?: string;
    proposedByAgentIds?: string[];
    supportingTaskIds?: string[];
    confidence?: number;
    expectedImpact?: number;
  }) {
    const title = input.title?.trim();

    if (!title) {
      throw new BadRequestException(
        'Decision title is required',
      );
    }

    const agentIds =
      input.proposedByAgentIds ?? [];

    const taskIds =
      input.supportingTaskIds ?? [];

    agentIds.forEach((agentId) =>
      this.getAgent(agentId),
    );

    taskIds.forEach((taskId) =>
      this.getTask(taskId),
    );

    const decision: OrganizationDecision = {
      id: randomUUID(),
      title,
      recommendation:
        input.recommendation?.trim() ?? '',
      rationale:
        input.rationale?.trim() ?? '',
      proposedByAgentIds: [
        ...new Set(agentIds),
      ],
      supportingTaskIds: [
        ...new Set(taskIds),
      ],
      confidence: this.score(
        input.confidence ?? 0,
      ),
      expectedImpact: this.score(
        input.expectedImpact ?? 0,
      ),
      status: 'proposed',
      humanApproved: false,
      decidedBy: '',
      decidedAt: '',
      createdAt: new Date().toISOString(),
    };

    this.decisions.set(
      decision.id,
      decision,
    );

    return decision;
  }

  listDecisions() {
    return [...this.decisions.values()];
  }

  getDecision(id: string) {
    const decision = this.decisions.get(id);

    if (!decision) {
      throw new NotFoundException(
        `Decision '${id}' was not found`,
      );
    }

    return decision;
  }

  submitDecisionForHumanReview(id: string) {
    const decision = this.getDecision(id);

    const updated = {
      ...decision,
      status: 'human-review' as const,
    };

    this.decisions.set(id, updated);

    return updated;
  }

  approveDecision(
    id: string,
    decidedBy: string,
  ) {
    const decision = this.getDecision(id);

    const updated: OrganizationDecision = {
      ...decision,
      status: 'approved',
      humanApproved: true,
      decidedBy:
        decidedBy?.trim() ||
        'Human Final Authority',
      decidedAt: new Date().toISOString(),
    };

    this.decisions.set(id, updated);

    return updated;
  }

  rejectDecision(
    id: string,
    decidedBy: string,
  ) {
    const decision = this.getDecision(id);

    const updated: OrganizationDecision = {
      ...decision,
      status: 'rejected',
      humanApproved: false,
      decidedBy:
        decidedBy?.trim() ||
        'Human Final Authority',
      decidedAt: new Date().toISOString(),
    };

    this.decisions.set(id, updated);

    return updated;
  }

  executeDecision(id: string) {
    const decision = this.getDecision(id);

    if (!decision.humanApproved) {
      throw new BadRequestException(
        'Human approval is required before decision execution',
      );
    }

    const updated: OrganizationDecision = {
      ...decision,
      status: 'executed',
    };

    this.decisions.set(id, updated);

    return updated;
  }

  generateTeamPlan(projectId: string) {
    return {
      projectId,
      recommendedTeam: [
        'researcher',
        'strategist',
        'writer',
        'producer',
        'editor',
        'publisher',
        'growth',
        'monetization',
        'ip-specialist',
        'compliance',
        'analyst',
        'coordinator',
      ],
      coordinationStages: [
        'project-understanding',
        'task-decomposition',
        'agent-selection',
        'dependency-mapping',
        'collaborative-execution',
        'quality-validation',
        'human-final-review',
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  generateOrganizationReport() {
    return {
      dashboard: this.getDashboard(),
      agents: this.listAgents(),
      tasks: this.listTasks(),
      workflows: this.listWorkflows(),
      memory: this.listMemory(),
      decisions: this.listDecisions(),
      humanFinalAuthority: true,
      generatedAt: new Date().toISOString(),
    };
  }

  private average(values: number[]) {
    if (values.length === 0) {
      return 0;
    }

    return Number(
      (
        values.reduce(
          (total, value) => total + value,
          0,
        ) / values.length
      ).toFixed(2),
    );
  }

  private score(value: number) {
    if (!Number.isFinite(value)) {
      throw new BadRequestException(
        'Score must be a valid number',
      );
    }

    return Number(
      Math.max(0, Math.min(100, value)).toFixed(2),
    );
  }

  private normalizeList(
    values?: string[],
    lowercase = true,
  ) {
    if (!values) {
      return [];
    }

    return [
      ...new Set(
        values
          .map((value) => {
            const normalized = value.trim();

            return lowercase
              ? normalized.toLowerCase()
              : normalized;
          })
          .filter(Boolean),
      ),
    ];
  }
}
