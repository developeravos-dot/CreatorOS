import { randomUUID } from 'node:crypto';

export type WorkflowDefinitionStatus =
  | 'draft'
  | 'active'
  | 'archived';

export type WorkflowInstanceStatus =
  | 'pending'
  | 'running'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type WorkflowTaskStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'skipped';

export type WorkflowTaskType =
  | 'action'
  | 'decision'
  | 'approval'
  | 'event'
  | 'human'
  | 'agent'
  | 'custom';

export interface WorkflowTaskDefinition {
  id: string;
  name: string;
  type: WorkflowTaskType;
  description?: string;
  order: number;
  required: boolean;
  configuration: Record<string, unknown>;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description?: string;
  version: number;
  status: WorkflowDefinitionStatus;
  tasks: WorkflowTaskDefinition[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowTaskExecution {
  taskId: string;
  taskName: string;
  taskType: WorkflowTaskType;
  status: WorkflowTaskStatus;
  startedAt?: string;
  completedAt?: string;
  output?: unknown;
  error?: string;
}

export interface WorkflowInstance {
  id: string;
  definitionId: string;
  definitionVersion: number;
  status: WorkflowInstanceStatus;
  currentTaskIndex: number;
  context: Record<string, unknown>;
  tasks: WorkflowTaskExecution[];
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  pausedAt?: string;
  cancelledAt?: string;
  failureReason?: string;
}

export interface CreateWorkflowTaskInput {
  id?: string;
  name: string;
  type: WorkflowTaskType;
  description?: string;
  order?: number;
  required?: boolean;
  configuration?: Record<string, unknown>;
}

export interface CreateWorkflowDefinitionInput {
  name: string;
  description?: string;
  status?: WorkflowDefinitionStatus;
  tasks: CreateWorkflowTaskInput[];
}

export interface StartWorkflowInput {
  definitionId: string;
  context?: Record<string, unknown>;
}

export interface CompleteTaskInput {
  output?: unknown;
  contextUpdates?: Record<string, unknown>;
}

export interface FailTaskInput {
  error: string;
}

export class WorkflowDefinitionNotFoundError extends Error {
  constructor(definitionId: string) {
    super(`Workflow definition ${definitionId} was not found`);
    this.name = 'WorkflowDefinitionNotFoundError';
  }
}

export class WorkflowInstanceNotFoundError extends Error {
  constructor(instanceId: string) {
    super(`Workflow instance ${instanceId} was not found`);
    this.name = 'WorkflowInstanceNotFoundError';
  }
}

export class InvalidWorkflowStateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidWorkflowStateError';
  }
}

export class WorkflowValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WorkflowValidationError';
  }
}

export class InMemoryWorkflowEngine {
  private readonly definitions =
    new Map<string, WorkflowDefinition>();

  private readonly instances =
    new Map<string, WorkflowInstance>();

  createDefinition(
    input: CreateWorkflowDefinitionInput,
  ): WorkflowDefinition {
    if (!input.name.trim()) {
      throw new WorkflowValidationError(
        'Workflow definition name is required',
      );
    }

    if (input.tasks.length === 0) {
      throw new WorkflowValidationError(
        'A workflow definition must contain at least one task',
      );
    }

    const timestamp = new Date().toISOString();

    const tasks = input.tasks
      .map((task, index): WorkflowTaskDefinition => {
        const baseTask: WorkflowTaskDefinition = {
          id: task.id ?? randomUUID(),
          name: task.name,
          type: task.type,
          order: task.order ?? index + 1,
          required: task.required ?? true,
          configuration: task.configuration ?? {},
        };

        if (task.description !== undefined) {
          baseTask.description = task.description;
        }

        return baseTask;
      })
      .sort((left, right) => left.order - right.order);

    const duplicateTaskIds = tasks
      .map((task) => task.id)
      .filter(
        (taskId, index, taskIds) =>
          taskIds.indexOf(taskId) !== index,
      );

    if (duplicateTaskIds.length > 0) {
      throw new WorkflowValidationError(
        'Workflow task IDs must be unique',
      );
    }

    const definition: WorkflowDefinition = {
      id: randomUUID(),
      name: input.name,
      version: 1,
      status: input.status ?? 'active',
      tasks,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    if (input.description !== undefined) {
      definition.description = input.description;
    }

    this.definitions.set(
      definition.id,
      definition,
    );

    return definition;
  }

  getDefinitions(): WorkflowDefinition[] {
    return Array.from(this.definitions.values());
  }

  getDefinitionById(
    definitionId: string,
  ): WorkflowDefinition | undefined {
    return this.definitions.get(definitionId);
  }

  startWorkflow(
    input: StartWorkflowInput,
  ): WorkflowInstance {
    const definition =
      this.definitions.get(input.definitionId);

    if (!definition) {
      throw new WorkflowDefinitionNotFoundError(
        input.definitionId,
      );
    }

    if (definition.status !== 'active') {
      throw new InvalidWorkflowStateError(
        `Workflow definition ${definition.id} is not active`,
      );
    }

    const timestamp = new Date().toISOString();

    const instance: WorkflowInstance = {
      id: randomUUID(),
      definitionId: definition.id,
      definitionVersion: definition.version,
      status: 'running',
      currentTaskIndex: 0,
      context: input.context ?? {},
      tasks: definition.tasks.map(
        (task): WorkflowTaskExecution => ({
          taskId: task.id,
          taskName: task.name,
          taskType: task.type,
          status: 'pending',
        }),
      ),
      createdAt: timestamp,
      startedAt: timestamp,
    };

    const firstTask = instance.tasks[0];

    if (firstTask) {
      firstTask.status = 'running';
      firstTask.startedAt = timestamp;
    }

    this.instances.set(
      instance.id,
      instance,
    );

    return instance;
  }

  getInstances(): WorkflowInstance[] {
    return Array.from(this.instances.values());
  }

  getInstanceById(
    instanceId: string,
  ): WorkflowInstance | undefined {
    return this.instances.get(instanceId);
  }

  completeCurrentTask(
    instanceId: string,
    input: CompleteTaskInput = {},
  ): WorkflowInstance {
    const instance =
      this.requireInstance(instanceId);

    if (instance.status !== 'running') {
      throw new InvalidWorkflowStateError(
        `Workflow instance ${instanceId} is not running`,
      );
    }

    const currentTask =
      instance.tasks[instance.currentTaskIndex];

    if (!currentTask) {
      throw new InvalidWorkflowStateError(
        `Workflow instance ${instanceId} has no current task`,
      );
    }

    if (currentTask.status !== 'running') {
      throw new InvalidWorkflowStateError(
        `Current task ${currentTask.taskId} is not running`,
      );
    }

    const timestamp = new Date().toISOString();

    currentTask.status = 'completed';
    currentTask.completedAt = timestamp;

    if (input.output !== undefined) {
      currentTask.output = input.output;
    }

    if (input.contextUpdates) {
      instance.context = {
        ...instance.context,
        ...input.contextUpdates,
      };
    }

    const nextTaskIndex =
      instance.currentTaskIndex + 1;

    const nextTask =
      instance.tasks[nextTaskIndex];

    if (!nextTask) {
      instance.status = 'completed';
      instance.completedAt = timestamp;

      return instance;
    }

    instance.currentTaskIndex =
      nextTaskIndex;

    nextTask.status = 'running';
    nextTask.startedAt = timestamp;

    return instance;
  }

  failCurrentTask(
    instanceId: string,
    input: FailTaskInput,
  ): WorkflowInstance {
    const instance =
      this.requireInstance(instanceId);

    if (instance.status !== 'running') {
      throw new InvalidWorkflowStateError(
        `Workflow instance ${instanceId} is not running`,
      );
    }

    const currentTask =
      instance.tasks[instance.currentTaskIndex];

    if (!currentTask) {
      throw new InvalidWorkflowStateError(
        `Workflow instance ${instanceId} has no current task`,
      );
    }

    const timestamp = new Date().toISOString();

    currentTask.status = 'failed';
    currentTask.completedAt = timestamp;
    currentTask.error = input.error;

    instance.status = 'failed';
    instance.completedAt = timestamp;
    instance.failureReason = input.error;

    return instance;
  }

  pauseWorkflow(
    instanceId: string,
  ): WorkflowInstance {
    const instance =
      this.requireInstance(instanceId);

    if (instance.status !== 'running') {
      throw new InvalidWorkflowStateError(
        `Only running workflows can be paused`,
      );
    }

    instance.status = 'paused';
    instance.pausedAt =
      new Date().toISOString();

    return instance;
  }

  resumeWorkflow(
    instanceId: string,
  ): WorkflowInstance {
    const instance =
      this.requireInstance(instanceId);

    if (instance.status !== 'paused') {
      throw new InvalidWorkflowStateError(
        `Only paused workflows can be resumed`,
      );
    }

    instance.status = 'running';
    delete instance.pausedAt;

    return instance;
  }

  cancelWorkflow(
    instanceId: string,
  ): WorkflowInstance {
    const instance =
      this.requireInstance(instanceId);

    if (
      instance.status === 'completed' ||
      instance.status === 'failed' ||
      instance.status === 'cancelled'
    ) {
      throw new InvalidWorkflowStateError(
        `Finished workflows cannot be cancelled`,
      );
    }

    const timestamp = new Date().toISOString();
    const currentTask =
      instance.tasks[instance.currentTaskIndex];

    if (
      currentTask &&
      currentTask.status === 'running'
    ) {
      currentTask.status = 'skipped';
      currentTask.completedAt = timestamp;
    }

    instance.status = 'cancelled';
    instance.cancelledAt = timestamp;
    instance.completedAt = timestamp;

    return instance;
  }

  getStatus() {
    const instances = this.getInstances();

    return {
      package: '@creatoros/workflow',
      status: 'operational' as const,
      provider: 'InMemoryWorkflowEngine',
      definitions: this.definitions.size,
      instances: this.instances.size,
      running: instances.filter(
        (instance) =>
          instance.status === 'running',
      ).length,
      paused: instances.filter(
        (instance) =>
          instance.status === 'paused',
      ).length,
      completed: instances.filter(
        (instance) =>
          instance.status === 'completed',
      ).length,
      failed: instances.filter(
        (instance) =>
          instance.status === 'failed',
      ).length,
      cancelled: instances.filter(
        (instance) =>
          instance.status === 'cancelled',
      ).length,
    };
  }

  private requireInstance(
    instanceId: string,
  ): WorkflowInstance {
    const instance =
      this.instances.get(instanceId);

    if (!instance) {
      throw new WorkflowInstanceNotFoundError(
        instanceId,
      );
    }

    return instance;
  }
}
