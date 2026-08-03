import type {
  FactoryPackId,
  FactoryStepId,
  FactoryValidationGateId,
} from "../domain";

export type FactoryExecutionPlanId =
  string & {
    readonly __factoryExecutionPlanId:
      unique symbol;
  };

export type FactoryExecutionPlanStatus =
  | "draft"
  | "ready"
  | "running"
  | "paused"
  | "failed"
  | "rolling-back"
  | "rolled-back"
  | "completed"
  | "cancelled";

export type FactoryExecutionPlanStepKind =
  | "analysis"
  | "generation"
  | "integration"
  | "validation"
  | "repair"
  | "release"
  | "rollback";

export type FactoryExecutionPlanStepStatus =
  | "pending"
  | "ready"
  | "running"
  | "succeeded"
  | "failed"
  | "blocked"
  | "skipped"
  | "cancelled"
  | "rolled-back";

export interface FactoryExecutionPlanStep {
  readonly id:
    FactoryStepId;
  readonly planId:
    FactoryExecutionPlanId;
  readonly packId:
    FactoryPackId;
  readonly name: string;
  readonly description: string;
  readonly kind:
    FactoryExecutionPlanStepKind;
  readonly order: number;
  readonly status:
    FactoryExecutionPlanStepStatus;
  readonly dependencies:
    readonly FactoryStepId[];
  readonly rollbackStepId:
    FactoryStepId | null;
  readonly validationGateIds:
    readonly FactoryValidationGateId[];
  readonly required: boolean;
  readonly attempts: number;
  readonly maxAttempts: number;
  readonly startedAt:
    string | null;
  readonly completedAt:
    string | null;
  readonly error:
    string | null;
  readonly metadata:
    Readonly<
      Record<
        string,
        unknown
      >
    >;
}

export interface FactoryExecutionPlan {
  readonly id:
    FactoryExecutionPlanId;
  readonly packId:
    FactoryPackId;
  readonly name: string;
  readonly description: string;
  readonly status:
    FactoryExecutionPlanStatus;
  readonly version: number;
  readonly steps:
    readonly FactoryExecutionPlanStep[];
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly startedAt:
    string | null;
  readonly completedAt:
    string | null;
  readonly failedStepId:
    FactoryStepId | null;
  readonly metadata:
    Readonly<
      Record<
        string,
        unknown
      >
    >;
}

export interface CreateFactoryExecutionPlanInput {
  readonly id: string;
  readonly packId:
    FactoryPackId;
  readonly name: string;
  readonly description?: string;
  readonly createdAt?: string;
  readonly metadata?:
    Readonly<
      Record<
        string,
        unknown
      >
    >;
}

export interface CreateFactoryExecutionPlanStepInput {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly kind:
    FactoryExecutionPlanStepKind;
  readonly order: number;
  readonly dependencies?:
    readonly FactoryStepId[];
  readonly rollbackStepId?:
    FactoryStepId | null;
  readonly validationGateIds?:
    readonly FactoryValidationGateId[];
  readonly required?: boolean;
  readonly maxAttempts?: number;
  readonly metadata?:
    Readonly<
      Record<
        string,
        unknown
      >
    >;
}

export interface FactoryExecutionPlanValidationIssue {
  readonly code:
    | "NO_STEPS"
    | "DUPLICATE_STEP"
    | "MISSING_DEPENDENCY"
    | "CIRCULAR_DEPENDENCY"
    | "MISSING_ROLLBACK_STEP"
    | "INVALID_ATTEMPT_LIMIT"
    | "INVALID_ORDER";
  readonly path: string;
  readonly message: string;
}

export interface FactoryExecutionPlanValidationResult {
  readonly valid: boolean;
  readonly issues:
    readonly FactoryExecutionPlanValidationIssue[];
}

export interface FactoryExecutionPlanProgress {
  readonly total: number;
  readonly pending: number;
  readonly ready: number;
  readonly running: number;
  readonly succeeded: number;
  readonly failed: number;
  readonly blocked: number;
  readonly skipped: number;
  readonly cancelled: number;
  readonly rolledBack: number;
  readonly completedPercent: number;
}

export interface FactoryExecutionPlanNextStepResult {
  readonly step:
    FactoryExecutionPlanStep | null;
  readonly blocked:
    readonly FactoryExecutionPlanStep[];
}
