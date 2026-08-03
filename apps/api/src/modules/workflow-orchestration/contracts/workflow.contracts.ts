import type {
  CreateWorkflowDefinitionInput,
  CreateWorkflowExecutionInput,
  WorkflowContext,
  WorkflowDefinition,
  WorkflowExecution,
  WorkflowExecutionState,
  WorkflowFailureStrategy,
  WorkflowState,
  WorkflowStep,
  WorkflowStepExecution,
  WorkflowStepState,
  WorkflowTransition,
  WorkflowTrigger,
  WorkflowType,
  WorkflowVariable,
  WorkflowVersion,
} from '../models';

export interface WorkflowIdentifierContract {
  readonly workflowId: string;
}

export interface WorkflowExecutionIdentifierContract
  extends WorkflowIdentifierContract {
  readonly executionId: string;
}

export interface WorkflowStepIdentifierContract
  extends WorkflowExecutionIdentifierContract {
  readonly stepId: string;
}

export interface WorkflowStepExecutionIdentifierContract
  extends WorkflowStepIdentifierContract {
  readonly stepExecutionId: string;
}

export interface CreateWorkflowContract
  extends CreateWorkflowDefinitionInput {}

export interface UpdateWorkflowContract {
  readonly name?: string;
  readonly description?: string;
  readonly type?: WorkflowType;
  readonly entryStepId?: string;
  readonly steps?:
    readonly WorkflowStep[];
  readonly transitions?:
    readonly WorkflowTransition[];
  readonly triggers?:
    readonly WorkflowTrigger[];
  readonly variables?:
    readonly WorkflowVariable[];
  readonly tags?:
    readonly string[];
  readonly labels?:
    Readonly<Record<string, string>>;
}

export interface WorkflowStateTransitionContract
  extends WorkflowIdentifierContract {
  readonly targetState:
    WorkflowState;
  readonly reason?: string;
  readonly requestedBy?: string;
}

export interface PublishWorkflowContract
  extends WorkflowIdentifierContract {
  readonly changeSummary?: string;
  readonly requestedBy?: string;
}

export interface ArchiveWorkflowContract
  extends WorkflowIdentifierContract {
  readonly reason?: string;
  readonly requestedBy?: string;
}

export interface CloneWorkflowContract
  extends WorkflowIdentifierContract {
  readonly name?: string;
  readonly requestedBy?: string;
}

export interface CreateWorkflowVersionContract
  extends WorkflowIdentifierContract {
  readonly changeSummary?: string;
  readonly requestedBy?: string;
}

export interface RestoreWorkflowVersionContract
  extends WorkflowIdentifierContract {
  readonly version: number;
  readonly requestedBy?: string;
}

export interface StartWorkflowExecutionContract
  extends CreateWorkflowExecutionInput {}

export interface PauseWorkflowExecutionContract
  extends WorkflowExecutionIdentifierContract {
  readonly reason?: string;
  readonly requestedBy?: string;
}

export interface ResumeWorkflowExecutionContract
  extends WorkflowExecutionIdentifierContract {
  readonly requestedBy?: string;
}

export interface CancelWorkflowExecutionContract
  extends WorkflowExecutionIdentifierContract {
  readonly reason?: string;
  readonly requestedBy?: string;
  readonly compensate?: boolean;
}

export interface CompleteWorkflowExecutionContract
  extends WorkflowExecutionIdentifierContract {
  readonly output?:
    Readonly<Record<string, unknown>>;
  readonly completedAt?: string;
}

export interface FailWorkflowExecutionContract
  extends WorkflowExecutionIdentifierContract {
  readonly code?: string;
  readonly message: string;
  readonly retryable: boolean;
  readonly details?:
    Readonly<Record<string, unknown>>;
  readonly failedAt?: string;
}

export interface QueueWorkflowStepContract
  extends WorkflowStepIdentifierContract {
  readonly input?:
    Readonly<Record<string, unknown>>;
}

export interface StartWorkflowStepContract
  extends WorkflowStepExecutionIdentifierContract {
  readonly workerId: string;
  readonly startedAt?: string;
}

export interface CompleteWorkflowStepContract
  extends WorkflowStepExecutionIdentifierContract {
  readonly output?:
    Readonly<Record<string, unknown>>;
  readonly finishedAt?: string;
}

export interface FailWorkflowStepContract
  extends WorkflowStepExecutionIdentifierContract {
  readonly code?: string;
  readonly message: string;
  readonly retryable: boolean;
  readonly details?:
    Readonly<Record<string, unknown>>;
  readonly finishedAt?: string;
}

export interface SkipWorkflowStepContract
  extends WorkflowStepIdentifierContract {
  readonly reason?: string;
}

export interface RetryWorkflowStepContract
  extends WorkflowStepExecutionIdentifierContract {
  readonly delayMs?: number;
  readonly resetAttemptCount?: boolean;
}

export interface ApproveWorkflowStepContract
  extends WorkflowStepIdentifierContract {
  readonly approvedBy: string;
  readonly comment?: string;
}

export interface RejectWorkflowStepContract
  extends WorkflowStepIdentifierContract {
  readonly rejectedBy: string;
  readonly comment?: string;
}

export interface UpdateWorkflowContextContract
  extends WorkflowExecutionIdentifierContract {
  readonly variables?:
    readonly WorkflowVariable[];
  readonly input?:
    Readonly<Record<string, unknown>>;
  readonly output?:
    Readonly<Record<string, unknown>>;
  readonly metadata?:
    Readonly<Record<string, unknown>>;
}

export interface SetWorkflowVariableContract
  extends WorkflowExecutionIdentifierContract {
  readonly variable:
    WorkflowVariable;
}

export interface DeleteWorkflowVariableContract
  extends WorkflowExecutionIdentifierContract {
  readonly variableName: string;
}

export interface WorkflowListQueryContract {
  readonly search?: string;
  readonly ids?:
    readonly string[];
  readonly states?:
    readonly WorkflowState[];
  readonly types?:
    readonly WorkflowType[];
  readonly ownerIds?:
    readonly string[];
  readonly tenantId?: string;
  readonly workspaceId?: string;
  readonly tags?:
    readonly string[];
  readonly createdFrom?: string;
  readonly createdTo?: string;
  readonly updatedFrom?: string;
  readonly updatedTo?: string;
  readonly versionFrom?: number;
  readonly versionTo?: number;
  readonly hasActiveTrigger?: boolean;
  readonly sortBy?:
    | 'createdAt'
    | 'updatedAt'
    | 'name'
    | 'state'
    | 'type'
    | 'version';
  readonly sortDirection?:
    | 'asc'
    | 'desc';
  readonly page?: number;
  readonly pageSize?: number;
}

export interface WorkflowExecutionListQueryContract {
  readonly workflowId?: string;
  readonly executionIds?:
    readonly string[];
  readonly states?:
    readonly WorkflowExecutionState[];
  readonly triggerTypes?:
    readonly WorkflowTrigger['type'][];
  readonly correlationId?: string;
  readonly traceId?: string;
  readonly startedFrom?: string;
  readonly startedTo?: string;
  readonly finishedFrom?: string;
  readonly finishedTo?: string;
  readonly sortBy?:
    | 'createdAt'
    | 'updatedAt'
    | 'startedAt'
    | 'finishedAt'
    | 'durationMs'
    | 'state';
  readonly sortDirection?:
    | 'asc'
    | 'desc';
  readonly page?: number;
  readonly pageSize?: number;
}

export interface WorkflowStepExecutionListQueryContract {
  readonly workflowExecutionId?: string;
  readonly stepIds?:
    readonly string[];
  readonly states?:
    readonly WorkflowStepState[];
  readonly workerIds?:
    readonly string[];
  readonly attemptFrom?: number;
  readonly attemptTo?: number;
  readonly startedFrom?: string;
  readonly startedTo?: string;
  readonly finishedFrom?: string;
  readonly finishedTo?: string;
  readonly page?: number;
  readonly pageSize?: number;
}

export interface WorkflowVersionListQueryContract
  extends WorkflowIdentifierContract {
  readonly published?: boolean;
  readonly versionFrom?: number;
  readonly versionTo?: number;
  readonly sortDirection?:
    | 'asc'
    | 'desc';
  readonly page?: number;
  readonly pageSize?: number;
}

export interface WorkflowPaginationContract {
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly totalPages: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;
}

export interface WorkflowListResultContract {
  readonly count: number;
  readonly total: number;
  readonly pagination:
    WorkflowPaginationContract;
  readonly workflows:
    readonly WorkflowDefinition[];
}

export interface WorkflowExecutionListResultContract {
  readonly count: number;
  readonly total: number;
  readonly pagination:
    WorkflowPaginationContract;
  readonly executions:
    readonly WorkflowExecution[];
}

export interface WorkflowStepExecutionListResultContract {
  readonly count: number;
  readonly total: number;
  readonly pagination:
    WorkflowPaginationContract;
  readonly stepExecutions:
    readonly WorkflowStepExecution[];
}

export interface WorkflowVersionListResultContract {
  readonly count: number;
  readonly total: number;
  readonly pagination:
    WorkflowPaginationContract;
  readonly versions:
    readonly WorkflowVersion[];
}

export interface WorkflowDetailsContract {
  readonly workflow:
    WorkflowDefinition;
  readonly latestVersion?:
    WorkflowVersion;
  readonly activeExecutions:
    readonly WorkflowExecution[];
}

export interface WorkflowExecutionDetailsContract {
  readonly execution:
    WorkflowExecution;
  readonly workflow:
    WorkflowDefinition;
  readonly currentSteps:
    readonly WorkflowStep[];
  readonly context:
    WorkflowContext;
}

export interface WorkflowOperationResultContract {
  readonly successful: boolean;
  readonly workflowId: string;
  readonly executionId?: string;
  readonly stepId?: string;
  readonly state?:
    | WorkflowState
    | WorkflowExecutionState
    | WorkflowStepState;
  readonly message: string;
  readonly workflow?:
    WorkflowDefinition;
  readonly execution?:
    WorkflowExecution;
  readonly stepExecution?:
    WorkflowStepExecution;
}

export interface WorkflowBulkOperationFailureContract {
  readonly workflowId: string;
  readonly executionId?: string;
  readonly code?: string;
  readonly message: string;
}

export interface WorkflowBulkOperationResultContract {
  readonly requested: number;
  readonly successful: number;
  readonly failed: number;
  readonly workflowIds:
    readonly string[];
  readonly failures:
    readonly WorkflowBulkOperationFailureContract[];
}

export interface BulkWorkflowIdsContract {
  readonly workflowIds:
    readonly string[];
}

export interface BulkPublishWorkflowsContract
  extends BulkWorkflowIdsContract {
  readonly requestedBy?: string;
  readonly changeSummary?: string;
}

export interface BulkPauseWorkflowsContract
  extends BulkWorkflowIdsContract {
  readonly requestedBy?: string;
  readonly reason?: string;
}

export interface BulkArchiveWorkflowsContract
  extends BulkWorkflowIdsContract {
  readonly requestedBy?: string;
  readonly reason?: string;
}

export interface BulkDeleteWorkflowsContract
  extends BulkWorkflowIdsContract {
  readonly force: boolean;
  readonly deleteVersions: boolean;
  readonly deleteExecutions: boolean;
}

export interface WorkflowTransitionEvaluationContract {
  readonly executionId: string;
  readonly fromStepId: string;
  readonly context:
    WorkflowContext;
  readonly transitions:
    readonly WorkflowTransition[];
}

export interface WorkflowTransitionEvaluationResultContract {
  readonly matched: boolean;
  readonly transition?:
    WorkflowTransition;
  readonly nextStepId?: string;
  readonly evaluatedTransitionIds:
    readonly string[];
  readonly reason: string;
}

export interface WorkflowFailurePolicyEvaluationContract {
  readonly executionId: string;
  readonly stepExecutionId: string;
  readonly failureStrategy:
    WorkflowFailureStrategy;
  readonly attemptNumber: number;
  readonly maximumAttempts: number;
  readonly retryable: boolean;
}

export interface WorkflowFailurePolicyDecisionContract {
  readonly action:
    | 'retry'
    | 'skip'
    | 'continue'
    | 'fail'
    | 'pause'
    | 'compensate';
  readonly delayMs?: number;
  readonly reason: string;
}

export interface WorkflowHealthContract {
  readonly status:
    | 'healthy'
    | 'degraded'
    | 'unhealthy';
  readonly totalWorkflows: number;
  readonly activeWorkflows: number;
  readonly runningExecutions: number;
  readonly failedExecutions: number;
  readonly pausedExecutions: number;
  readonly timedOutExecutions: number;
  readonly waitingApprovals: number;
  readonly generatedAt: string;
}

export interface WorkflowExportContract {
  readonly format:
    | 'json'
    | 'csv';
  readonly query?:
    WorkflowListQueryContract;
}

export interface WorkflowExportResultContract {
  readonly format:
    | 'json'
    | 'csv';
  readonly filename: string;
  readonly contentType: string;
  readonly workflowCount: number;
  readonly content: string;
  readonly generatedAt: string;
}