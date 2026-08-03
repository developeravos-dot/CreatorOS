import {
  Type,
} from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

import {
  WORKFLOW_EXECUTION_STATES,
  WORKFLOW_FAILURE_STRATEGIES,
  WORKFLOW_STATES,
  WORKFLOW_STEP_STATES,
  WORKFLOW_STEP_TYPES,
  WORKFLOW_TRANSITION_OPERATORS,
  WORKFLOW_TRIGGER_TYPES,
  WORKFLOW_TYPES,
  WORKFLOW_VARIABLE_TYPES,
  type WorkflowExecutionState,
  type WorkflowFailureStrategy,
  type WorkflowState,
  type WorkflowStepState,
  type WorkflowStepType,
  type WorkflowTransitionOperator,
  type WorkflowTriggerType,
  type WorkflowType,
  type WorkflowVariableType,
} from '../models';

export class WorkflowVariableDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsIn(WORKFLOW_VARIABLE_TYPES)
  type!: WorkflowVariableType;

  value!: unknown;

  @IsBoolean()
  mutable!: boolean;

  @IsBoolean()
  secret!: boolean;

  @IsOptional()
  @IsString()
  description?: string;
}

export class WorkflowTransitionConditionDto {
  @IsString()
  @MinLength(1)
  left!: string;

  @IsIn(WORKFLOW_TRANSITION_OPERATORS)
  operator!: WorkflowTransitionOperator;

  @IsOptional()
  right?: unknown;

  @IsOptional()
  @IsBoolean()
  negate?: boolean;
}

export class WorkflowTransitionDto {
  @IsString()
  @MinLength(1)
  id!: string;

  @IsString()
  @MinLength(1)
  fromStepId!: string;

  @IsString()
  @MinLength(1)
  toStepId!: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsInt()
  @Min(0)
  priority!: number;

  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(
    () =>
      WorkflowTransitionConditionDto,
  )
  conditions!: WorkflowTransitionConditionDto[];

  @IsBoolean()
  default!: boolean;
}

export class WorkflowRetryPolicyDto {
  @IsInt()
  @Min(1)
  maximumAttempts!: number;

  @IsInt()
  @Min(0)
  initialDelayMs!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  maximumDelayMs?: number;

  @IsNumber()
  @Min(1)
  multiplier!: number;

  @IsBoolean()
  jitter!: boolean;
}

export class WorkflowTimeoutPolicyDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  timeoutMs?: number;

  @IsIn([
    'timed_out',
  ])
  timeoutState!:
    'timed_out';
}

export class WorkflowStepConfigurationDto {
  @ValidateNested()
  @Type(
    () =>
      WorkflowRetryPolicyDto,
  )
  retry!: WorkflowRetryPolicyDto;

  @ValidateNested()
  @Type(
    () =>
      WorkflowTimeoutPolicyDto,
  )
  timeout!: WorkflowTimeoutPolicyDto;

  @IsIn(WORKFLOW_FAILURE_STRATEGIES)
  failureStrategy!:
    WorkflowFailureStrategy;

  @IsBoolean()
  continueOnFailure!: boolean;

  @IsBoolean()
  requiresApproval!: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  maximumConcurrency?: number;
}

export class WorkflowStepDto {
  @IsString()
  @MinLength(1)
  id!: string;

  @IsString()
  @MinLength(1)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsIn(WORKFLOW_STEP_TYPES)
  type!: WorkflowStepType;

  @IsOptional()
  @IsString()
  handler?: string;

  @IsObject()
  input!: Record<string, unknown>;

  @ValidateNested()
  @Type(
    () =>
      WorkflowStepConfigurationDto,
  )
  configuration!:
    WorkflowStepConfigurationDto;

  @IsArray()
  @IsString({
    each: true,
  })
  dependencies!: string[];

  @IsOptional()
  @IsString()
  compensationStepId?: string;

  @IsOptional()
  @IsArray()
  @IsString({
    each: true,
  })
  tags?: string[];

  @IsOptional()
  @IsObject()
  labels?: Record<string, string>;

  @IsOptional()
  @IsObject()
  position?: {
    x: number;
    y: number;
  };
}

export class WorkflowTriggerDto {
  @IsString()
  @MinLength(1)
  id!: string;

  @IsIn(WORKFLOW_TRIGGER_TYPES)
  type!: WorkflowTriggerType;

  @IsBoolean()
  enabled!: boolean;

  @IsObject()
  configuration!: Record<string, unknown>;
}

export class CreateWorkflowDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  @MinLength(1)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(WORKFLOW_TYPES)
  type?: WorkflowType;

  @IsString()
  @MinLength(1)
  entryStepId!: string;

  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(
    () =>
      WorkflowStepDto,
  )
  steps!: WorkflowStepDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(
    () =>
      WorkflowTransitionDto,
  )
  transitions?: WorkflowTransitionDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(
    () =>
      WorkflowTriggerDto,
  )
  triggers?: WorkflowTriggerDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(
    () =>
      WorkflowVariableDto,
  )
  variables?: WorkflowVariableDto[];

  @IsOptional()
  @IsObject()
  ownership?: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  @IsString({
    each: true,
  })
  tags?: string[];

  @IsOptional()
  @IsObject()
  labels?: Record<string, string>;
}

export class UpdateWorkflowDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(WORKFLOW_TYPES)
  type?: WorkflowType;

  @IsOptional()
  @IsString()
  entryStepId?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(
    () =>
      WorkflowStepDto,
  )
  steps?: WorkflowStepDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(
    () =>
      WorkflowTransitionDto,
  )
  transitions?: WorkflowTransitionDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(
    () =>
      WorkflowTriggerDto,
  )
  triggers?: WorkflowTriggerDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(
    () =>
      WorkflowVariableDto,
  )
  variables?: WorkflowVariableDto[];

  @IsOptional()
  @IsArray()
  @IsString({
    each: true,
  })
  tags?: string[];

  @IsOptional()
  @IsObject()
  labels?: Record<string, string>;
}

export class WorkflowStateTransitionDto {
  @IsIn(WORKFLOW_STATES)
  targetState!: WorkflowState;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  requestedBy?: string;
}

export class WorkflowCommandDto {
  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  requestedBy?: string;
}

export class StartWorkflowExecutionDto {
  @IsString()
  @MinLength(1)
  triggerId!: string;

  @IsOptional()
  @IsObject()
  input?: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(
    () =>
      WorkflowVariableDto,
  )
  variables?: WorkflowVariableDto[];

  @IsOptional()
  @IsObject()
  correlation?: Record<string, unknown>;
}

export class CancelWorkflowExecutionDto
  extends WorkflowCommandDto {
  @IsOptional()
  @IsBoolean()
  compensate?: boolean;
}

export class CompleteWorkflowExecutionDto {
  @IsOptional()
  @IsObject()
  output?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  completedAt?: string;
}

export class FailWorkflowExecutionDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsString()
  @MinLength(1)
  message!: string;

  @IsBoolean()
  retryable!: boolean;

  @IsOptional()
  @IsObject()
  details?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  failedAt?: string;
}

export class StartWorkflowStepDto {
  @IsString()
  @MinLength(1)
  workerId!: string;

  @IsOptional()
  @IsString()
  startedAt?: string;
}

export class CompleteWorkflowStepDto {
  @IsOptional()
  @IsObject()
  output?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  finishedAt?: string;
}

export class FailWorkflowStepDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsString()
  @MinLength(1)
  message!: string;

  @IsBoolean()
  retryable!: boolean;

  @IsOptional()
  @IsObject()
  details?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  finishedAt?: string;
}

export class WorkflowApprovalDto {
  @IsString()
  @MinLength(1)
  actorId!: string;

  @IsOptional()
  @IsString()
  comment?: string;
}

export class RetryWorkflowStepDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  delayMs?: number;

  @IsOptional()
  @IsBoolean()
  resetAttemptCount?: boolean;
}

export class SetWorkflowVariableDto {
  @ValidateNested()
  @Type(
    () =>
      WorkflowVariableDto,
  )
  variable!: WorkflowVariableDto;
}

export class UpdateWorkflowContextDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(
    () =>
      WorkflowVariableDto,
  )
  variables?: WorkflowVariableDto[];

  @IsOptional()
  @IsObject()
  input?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  output?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class WorkflowListQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsArray()
  @IsIn(
    WORKFLOW_STATES,
    {
      each: true,
    },
  )
  states?: WorkflowState[];

  @IsOptional()
  @IsArray()
  @IsIn(
    WORKFLOW_TYPES,
    {
      each: true,
    },
  )
  types?: WorkflowType[];

  @IsOptional()
  @IsString()
  tenantId?: string;

  @IsOptional()
  @IsString()
  workspaceId?: string;

  @IsOptional()
  @IsArray()
  @IsString({
    each: true,
  })
  tags?: string[];

  @IsOptional()
  @IsIn([
    'createdAt',
    'updatedAt',
    'name',
    'state',
    'type',
    'version',
  ])
  sortBy?:
    | 'createdAt'
    | 'updatedAt'
    | 'name'
    | 'state'
    | 'type'
    | 'version';

  @IsOptional()
  @IsIn([
    'asc',
    'desc',
  ])
  sortDirection?:
    | 'asc'
    | 'desc';

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  pageSize?: number;
}

export class WorkflowExecutionListQueryDto {
  @IsOptional()
  @IsString()
  workflowId?: string;

  @IsOptional()
  @IsArray()
  @IsIn(
    WORKFLOW_EXECUTION_STATES,
    {
      each: true,
    },
  )
  states?: WorkflowExecutionState[];

  @IsOptional()
  @IsArray()
  @IsIn(
    WORKFLOW_TRIGGER_TYPES,
    {
      each: true,
    },
  )
  triggerTypes?: WorkflowTriggerType[];

  @IsOptional()
  @IsString()
  correlationId?: string;

  @IsOptional()
  @IsString()
  traceId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  pageSize?: number;
}

export class WorkflowStepExecutionListQueryDto {
  @IsOptional()
  @IsString()
  workflowExecutionId?: string;

  @IsOptional()
  @IsArray()
  @IsIn(
    WORKFLOW_STEP_STATES,
    {
      each: true,
    },
  )
  states?: WorkflowStepState[];

  @IsOptional()
  @IsArray()
  @IsString({
    each: true,
  })
  workerIds?: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  pageSize?: number;
}

export class BulkWorkflowActionDto {
  @IsArray()
  @IsString({
    each: true,
  })
  workflowIds!: string[];

  @IsOptional()
  @IsString()
  requestedBy?: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  changeSummary?: string;

  @IsOptional()
  @IsBoolean()
  force?: boolean;
}