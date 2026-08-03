export const WORKFLOW_STATES = [
  'draft',
  'published',
  'active',
  'paused',
  'archived',
  'deprecated',
] as const;

export type WorkflowState =
  (typeof WORKFLOW_STATES)[number];

export const WORKFLOW_EXECUTION_STATES = [
  'pending',
  'queued',
  'running',
  'waiting',
  'paused',
  'completed',
  'failed',
  'cancelled',
  'timed_out',
  'compensating',
  'compensated',
] as const;

export type WorkflowExecutionState =
  (typeof WORKFLOW_EXECUTION_STATES)[number];

export const WORKFLOW_STEP_STATES = [
  'pending',
  'ready',
  'queued',
  'running',
  'waiting',
  'completed',
  'failed',
  'skipped',
  'cancelled',
  'timed_out',
  'compensating',
  'compensated',
] as const;

export type WorkflowStepState =
  (typeof WORKFLOW_STEP_STATES)[number];

export const WORKFLOW_TYPES = [
  'sequential',
  'parallel',
  'conditional',
  'event_driven',
  'scheduled',
  'human_in_the_loop',
  'hybrid',
  'custom',
] as const;

export type WorkflowType =
  (typeof WORKFLOW_TYPES)[number];

export const WORKFLOW_TRIGGER_TYPES = [
  'manual',
  'event',
  'schedule',
  'webhook',
  'job',
  'workflow',
  'api',
  'system',
] as const;

export type WorkflowTriggerType =
  (typeof WORKFLOW_TRIGGER_TYPES)[number];

export const WORKFLOW_STEP_TYPES = [
  'task',
  'decision',
  'parallel',
  'join',
  'delay',
  'wait_for_event',
  'human_approval',
  'sub_workflow',
  'job',
  'notification',
  'script',
  'integration',
  'compensation',
  'end',
] as const;

export type WorkflowStepType =
  (typeof WORKFLOW_STEP_TYPES)[number];

export const WORKFLOW_VARIABLE_TYPES = [
  'string',
  'number',
  'boolean',
  'object',
  'array',
  'date',
  'null',
] as const;

export type WorkflowVariableType =
  (typeof WORKFLOW_VARIABLE_TYPES)[number];

export const WORKFLOW_TRANSITION_OPERATORS = [
  'always',
  'equals',
  'not_equals',
  'greater_than',
  'greater_than_or_equal',
  'less_than',
  'less_than_or_equal',
  'contains',
  'not_contains',
  'exists',
  'not_exists',
  'in',
  'not_in',
  'matches',
] as const;

export type WorkflowTransitionOperator =
  (typeof WORKFLOW_TRANSITION_OPERATORS)[number];

export const WORKFLOW_FAILURE_STRATEGIES = [
  'fail_workflow',
  'retry_step',
  'skip_step',
  'continue',
  'compensate',
  'pause',
] as const;

export type WorkflowFailureStrategy =
  (typeof WORKFLOW_FAILURE_STRATEGIES)[number];

export interface WorkflowIdentity {
  readonly id: string;
  readonly name: string;
  readonly version: number;
}

export interface WorkflowTimestamps {
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface WorkflowOwnership {
  readonly createdBy?: string;
  readonly ownerType?:
    | 'user'
    | 'service'
    | 'agent'
    | 'system';
  readonly tenantId?: string;
  readonly workspaceId?: string;
}

export interface WorkflowCorrelation {
  readonly correlationId?: string;
  readonly causationId?: string;
  readonly traceId?: string;
  readonly parentWorkflowExecutionId?: string;
  readonly parentStepExecutionId?: string;
}

export interface WorkflowTagSet {
  readonly tags:
    readonly string[];

  readonly labels:
    Readonly<Record<string, string>>;
}

export interface WorkflowVariable {
  readonly name: string;
  readonly type:
    WorkflowVariableType;
  readonly value: unknown;
  readonly mutable: boolean;
  readonly secret: boolean;
  readonly description?: string;
}

export interface WorkflowContext {
  readonly variables:
    Readonly<
      Record<
        string,
        WorkflowVariable
      >
    >;

  readonly input:
    Readonly<Record<string, unknown>>;

  readonly output:
    Readonly<Record<string, unknown>>;

  readonly metadata:
    Readonly<Record<string, unknown>>;

  readonly correlation:
    WorkflowCorrelation;
}

export interface WorkflowTransitionCondition {
  readonly left:
    string;
  readonly operator:
    WorkflowTransitionOperator;
  readonly right?: unknown;
  readonly negate?: boolean;
}

export interface WorkflowTransition {
  readonly id: string;
  readonly fromStepId: string;
  readonly toStepId: string;
  readonly name?: string;
  readonly priority: number;
  readonly conditions:
    readonly WorkflowTransitionCondition[];
  readonly default: boolean;
}

export interface WorkflowRetryPolicy {
  readonly maximumAttempts: number;
  readonly initialDelayMs: number;
  readonly maximumDelayMs?: number;
  readonly multiplier: number;
  readonly jitter: boolean;
}

export interface WorkflowTimeoutPolicy {
  readonly timeoutMs?: number;
  readonly timeoutState:
    Extract<
      WorkflowStepState,
      'timed_out'
    >;
}

export interface WorkflowStepConfiguration {
  readonly retry:
    WorkflowRetryPolicy;

  readonly timeout:
    WorkflowTimeoutPolicy;

  readonly failureStrategy:
    WorkflowFailureStrategy;

  readonly continueOnFailure:
    boolean;

  readonly requiresApproval:
    boolean;

  readonly maximumConcurrency?: number;
}

export interface WorkflowStep {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly type:
    WorkflowStepType;
  readonly handler?: string;
  readonly input:
    Readonly<Record<string, unknown>>;
  readonly configuration:
    WorkflowStepConfiguration;
  readonly dependencies:
    readonly string[];
  readonly compensationStepId?: string;
  readonly tags:
    WorkflowTagSet;
  readonly position?: {
    readonly x: number;
    readonly y: number;
  };
}

export interface WorkflowTrigger {
  readonly id: string;
  readonly type:
    WorkflowTriggerType;
  readonly enabled: boolean;
  readonly configuration:
    Readonly<Record<string, unknown>>;
}

export interface WorkflowDefinition {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly type:
    WorkflowType;
  readonly state:
    WorkflowState;
  readonly version: number;
  readonly entryStepId: string;
  readonly steps:
    readonly WorkflowStep[];
  readonly transitions:
    readonly WorkflowTransition[];
  readonly triggers:
    readonly WorkflowTrigger[];
  readonly variables:
    readonly WorkflowVariable[];
  readonly ownership:
    WorkflowOwnership;
  readonly tags:
    WorkflowTagSet;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly publishedAt?: string;
}

export interface WorkflowStepExecution {
  readonly id: string;
  readonly workflowExecutionId: string;
  readonly stepId: string;
  readonly state:
    WorkflowStepState;
  readonly attemptNumber: number;
  readonly input:
    Readonly<Record<string, unknown>>;
  readonly output:
    Readonly<Record<string, unknown>>;
  readonly error?: {
    readonly code?: string;
    readonly message: string;
    readonly retryable: boolean;
    readonly details?:
      Readonly<Record<string, unknown>>;
  };
  readonly startedAt?: string;
  readonly finishedAt?: string;
  readonly durationMs?: number;
  readonly workerId?: string;
}

export interface WorkflowExecution {
  readonly id: string;
  readonly workflowId: string;
  readonly workflowVersion: number;
  readonly state:
    WorkflowExecutionState;
  readonly currentStepIds:
    readonly string[];
  readonly completedStepIds:
    readonly string[];
  readonly failedStepIds:
    readonly string[];
  readonly skippedStepIds:
    readonly string[];
  readonly stepExecutions:
    readonly WorkflowStepExecution[];
  readonly context:
    WorkflowContext;
  readonly trigger:
    WorkflowTrigger;
  readonly correlation:
    WorkflowCorrelation;
  readonly startedAt?: string;
  readonly finishedAt?: string;
  readonly durationMs?: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface WorkflowVersion {
  readonly workflowId: string;
  readonly version: number;
  readonly definition:
    WorkflowDefinition;
  readonly changeSummary?: string;
  readonly createdBy?: string;
  readonly createdAt: string;
  readonly published: boolean;
}

export interface CreateWorkflowDefinitionInput {
  readonly id?: string;
  readonly name: string;
  readonly description?: string;
  readonly type?: WorkflowType;
  readonly entryStepId: string;
  readonly steps:
    readonly WorkflowStep[];
  readonly transitions?:
    readonly WorkflowTransition[];
  readonly triggers?:
    readonly WorkflowTrigger[];
  readonly variables?:
    readonly WorkflowVariable[];
  readonly ownership?:
    WorkflowOwnership;
  readonly tags?:
    readonly string[];
  readonly labels?:
    Readonly<Record<string, string>>;
}

export interface CreateWorkflowExecutionInput {
  readonly id?: string;
  readonly workflow:
    WorkflowDefinition;
  readonly trigger:
    WorkflowTrigger;
  readonly input?:
    Readonly<Record<string, unknown>>;
  readonly variables?:
    readonly WorkflowVariable[];
  readonly correlation?:
    WorkflowCorrelation;
}

export function isWorkflowState(
  value: unknown,
): value is WorkflowState {
  return (
    typeof value === 'string' &&
    (
      WORKFLOW_STATES as
        readonly string[]
    ).includes(value)
  );
}

export function isWorkflowExecutionState(
  value: unknown,
): value is WorkflowExecutionState {
  return (
    typeof value === 'string' &&
    (
      WORKFLOW_EXECUTION_STATES as
        readonly string[]
    ).includes(value)
  );
}

export function isWorkflowStepState(
  value: unknown,
): value is WorkflowStepState {
  return (
    typeof value === 'string' &&
    (
      WORKFLOW_STEP_STATES as
        readonly string[]
    ).includes(value)
  );
}

export function isWorkflowType(
  value: unknown,
): value is WorkflowType {
  return (
    typeof value === 'string' &&
    (
      WORKFLOW_TYPES as
        readonly string[]
    ).includes(value)
  );
}

export function isWorkflowStepType(
  value: unknown,
): value is WorkflowStepType {
  return (
    typeof value === 'string' &&
    (
      WORKFLOW_STEP_TYPES as
        readonly string[]
    ).includes(value)
  );
}

export function createDefaultWorkflowRetryPolicy():
  WorkflowRetryPolicy {
  return {
    maximumAttempts: 3,
    initialDelayMs: 1_000,
    maximumDelayMs:
      60_000,
    multiplier: 2,
    jitter: false,
  };
}

export function createDefaultWorkflowStepConfiguration():
  WorkflowStepConfiguration {
  return {
    retry:
      createDefaultWorkflowRetryPolicy(),
    timeout: {
      timeoutState:
        'timed_out',
    },
    failureStrategy:
      'fail_workflow',
    continueOnFailure:
      false,
    requiresApproval:
      false,
  };
}

export class WorkflowDefinitionModel
  implements WorkflowDefinition {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly type:
    WorkflowType;
  readonly state:
    WorkflowState;
  readonly version: number;
  readonly entryStepId: string;
  readonly steps:
    readonly WorkflowStep[];
  readonly transitions:
    readonly WorkflowTransition[];
  readonly triggers:
    readonly WorkflowTrigger[];
  readonly variables:
    readonly WorkflowVariable[];
  readonly ownership:
    WorkflowOwnership;
  readonly tags:
    WorkflowTagSet;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly publishedAt?: string;

  constructor(
    workflow:
      WorkflowDefinition,
  ) {
    this.id =
      workflow.id;

    this.name =
      workflow.name;

    this.description =
      workflow.description;

    this.type =
      workflow.type;

    this.state =
      workflow.state;

    this.version =
      workflow.version;

    this.entryStepId =
      workflow.entryStepId;

    this.steps =
      workflow.steps.map(
        (step) =>
          cloneWorkflowStep(
            step,
          ),
      );

    this.transitions =
      workflow.transitions.map(
        (transition) =>
          cloneWorkflowTransition(
            transition,
          ),
      );

    this.triggers =
      workflow.triggers.map(
        (trigger) => ({
          ...trigger,
          configuration: {
            ...trigger.configuration,
          },
        }),
      );

    this.variables =
      workflow.variables.map(
        (variable) =>
          cloneWorkflowVariable(
            variable,
          ),
      );

    this.ownership = {
      ...workflow.ownership,
    };

    this.tags = {
      tags: [
        ...workflow.tags.tags,
      ],
      labels: {
        ...workflow.tags.labels,
      },
    };

    this.createdAt =
      workflow.createdAt;

    this.updatedAt =
      workflow.updatedAt;

    this.publishedAt =
      workflow.publishedAt;
  }

  toContract():
    WorkflowDefinition {
    return {
      id:
        this.id,
      name:
        this.name,
      description:
        this.description,
      type:
        this.type,
      state:
        this.state,
      version:
        this.version,
      entryStepId:
        this.entryStepId,
      steps:
        this.steps.map(
          (step) =>
            cloneWorkflowStep(
              step,
            ),
        ),
      transitions:
        this.transitions.map(
          (transition) =>
            cloneWorkflowTransition(
              transition,
            ),
        ),
      triggers:
        this.triggers.map(
          (trigger) => ({
            ...trigger,
            configuration: {
              ...trigger.configuration,
            },
          }),
        ),
      variables:
        this.variables.map(
          (variable) =>
            cloneWorkflowVariable(
              variable,
            ),
        ),
      ownership: {
        ...this.ownership,
      },
      tags: {
        tags: [
          ...this.tags.tags,
        ],
        labels: {
          ...this.tags.labels,
        },
      },
      createdAt:
        this.createdAt,
      updatedAt:
        this.updatedAt,
      publishedAt:
        this.publishedAt,
    };
  }
}

export class WorkflowExecutionModel
  implements WorkflowExecution {
  readonly id: string;
  readonly workflowId: string;
  readonly workflowVersion: number;
  readonly state:
    WorkflowExecutionState;
  readonly currentStepIds:
    readonly string[];
  readonly completedStepIds:
    readonly string[];
  readonly failedStepIds:
    readonly string[];
  readonly skippedStepIds:
    readonly string[];
  readonly stepExecutions:
    readonly WorkflowStepExecution[];
  readonly context:
    WorkflowContext;
  readonly trigger:
    WorkflowTrigger;
  readonly correlation:
    WorkflowCorrelation;
  readonly startedAt?: string;
  readonly finishedAt?: string;
  readonly durationMs?: number;
  readonly createdAt: string;
  readonly updatedAt: string;

  constructor(
    execution:
      WorkflowExecution,
  ) {
    this.id =
      execution.id;

    this.workflowId =
      execution.workflowId;

    this.workflowVersion =
      execution.workflowVersion;

    this.state =
      execution.state;

    this.currentStepIds = [
      ...execution.currentStepIds,
    ];

    this.completedStepIds = [
      ...execution.completedStepIds,
    ];

    this.failedStepIds = [
      ...execution.failedStepIds,
    ];

    this.skippedStepIds = [
      ...execution.skippedStepIds,
    ];

    this.stepExecutions =
      execution.stepExecutions
        .map(
          (stepExecution) =>
            cloneWorkflowStepExecution(
              stepExecution,
            ),
        );

    this.context =
      cloneWorkflowContext(
        execution.context,
      );

    this.trigger = {
      ...execution.trigger,
      configuration: {
        ...execution.trigger
          .configuration,
      },
    };

    this.correlation = {
      ...execution.correlation,
    };

    this.startedAt =
      execution.startedAt;

    this.finishedAt =
      execution.finishedAt;

    this.durationMs =
      execution.durationMs;

    this.createdAt =
      execution.createdAt;

    this.updatedAt =
      execution.updatedAt;
  }

  toContract():
    WorkflowExecution {
    return {
      id:
        this.id,
      workflowId:
        this.workflowId,
      workflowVersion:
        this.workflowVersion,
      state:
        this.state,
      currentStepIds: [
        ...this.currentStepIds,
      ],
      completedStepIds: [
        ...this.completedStepIds,
      ],
      failedStepIds: [
        ...this.failedStepIds,
      ],
      skippedStepIds: [
        ...this.skippedStepIds,
      ],
      stepExecutions:
        this.stepExecutions.map(
          (stepExecution) =>
            cloneWorkflowStepExecution(
              stepExecution,
            ),
        ),
      context:
        cloneWorkflowContext(
          this.context,
        ),
      trigger: {
        ...this.trigger,
        configuration: {
          ...this.trigger
            .configuration,
        },
      },
      correlation: {
        ...this.correlation,
      },
      startedAt:
        this.startedAt,
      finishedAt:
        this.finishedAt,
      durationMs:
        this.durationMs,
      createdAt:
        this.createdAt,
      updatedAt:
        this.updatedAt,
    };
  }
}

export function cloneWorkflowStep(
  step:
    WorkflowStep,
): WorkflowStep {
  return {
    ...step,
    input: {
      ...step.input,
    },
    configuration: {
      ...step.configuration,
      retry: {
        ...step.configuration
          .retry,
      },
      timeout: {
        ...step.configuration
          .timeout,
      },
    },
    dependencies: [
      ...step.dependencies,
    ],
    tags: {
      tags: [
        ...step.tags.tags,
      ],
      labels: {
        ...step.tags.labels,
      },
    },
    position:
      step.position
        ? {
            ...step.position,
          }
        : undefined,
  };
}

export function cloneWorkflowTransition(
  transition:
    WorkflowTransition,
): WorkflowTransition {
  return {
    ...transition,
    conditions:
      transition.conditions.map(
        (condition) => ({
          ...condition,
        }),
      ),
  };
}

export function cloneWorkflowVariable(
  variable:
    WorkflowVariable,
): WorkflowVariable {
  return {
    ...variable,
  };
}

export function cloneWorkflowContext(
  context:
    WorkflowContext,
): WorkflowContext {
  return {
    variables:
      Object.fromEntries(
        Object.entries(
          context.variables,
        ).map(
          ([key, variable]) => [
            key,
            cloneWorkflowVariable(
              variable,
            ),
          ],
        ),
      ),
    input: {
      ...context.input,
    },
    output: {
      ...context.output,
    },
    metadata: {
      ...context.metadata,
    },
    correlation: {
      ...context.correlation,
    },
  };
}

export function cloneWorkflowStepExecution(
  execution:
    WorkflowStepExecution,
): WorkflowStepExecution {
  return {
    ...execution,
    input: {
      ...execution.input,
    },
    output: {
      ...execution.output,
    },
    error:
      execution.error
        ? {
            ...execution.error,
            details:
              execution.error
                .details
                ? {
                    ...execution.error
                      .details,
                  }
                : undefined,
          }
        : undefined,
  };
}