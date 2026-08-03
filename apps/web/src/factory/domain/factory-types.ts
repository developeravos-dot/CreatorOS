export type FactoryPackId =
  string & {
    readonly __factoryPackId:
      unique symbol;
  };

export type FactoryStepId =
  string & {
    readonly __factoryStepId:
      unique symbol;
  };

export type FactoryValidationGateId =
  string & {
    readonly __factoryValidationGateId:
      unique symbol;
  };

export type FactoryPackStatus =
  | "draft"
  | "planned"
  | "generating"
  | "integrating"
  | "validating"
  | "repairing"
  | "failed"
  | "completed"
  | "cancelled";

export type FactoryPackType =
  | "foundation"
  | "workspace"
  | "engine"
  | "backend-module"
  | "integration"
  | "ai-agent"
  | "release"
  | "full-feature";

export type FactoryExecutionStepType =
  | "analyze"
  | "plan"
  | "generate"
  | "integrate"
  | "validate"
  | "repair"
  | "release"
  | "rollback";

export type FactoryExecutionStepStatus =
  | "pending"
  | "running"
  | "succeeded"
  | "failed"
  | "skipped"
  | "cancelled";

export type FactoryValidationGateType =
  | "vitest"
  | "typescript"
  | "eslint"
  | "build"
  | "encoding"
  | "git-diff"
  | "custom";

export type FactoryValidationGateStatus =
  | "pending"
  | "running"
  | "passed"
  | "failed"
  | "skipped";

export type FactoryErrorSeverity =
  | "info"
  | "warning"
  | "error"
  | "fatal";

export type FactoryErrorCode =
  | "INVALID_PACK"
  | "INVALID_STATUS_TRANSITION"
  | "DUPLICATE_STEP"
  | "STEP_NOT_FOUND"
  | "VALIDATION_FAILED"
  | "EXECUTION_FAILED"
  | "INTEGRATION_FAILED"
  | "REPAIR_FAILED"
  | "ROLLBACK_FAILED"
  | "RELEASE_FAILED"
  | "UNKNOWN";

export interface FactoryExecutionResult<
  TValue = unknown,
> {
  readonly success: boolean;
  readonly value:
    TValue | null;
  readonly error:
    FactoryErrorSnapshot | null;
  readonly startedAt: string;
  readonly completedAt: string;
  readonly durationMs: number;
}

export interface FactoryExecutionStep {
  readonly id:
    FactoryStepId;
  readonly packId:
    FactoryPackId;
  readonly type:
    FactoryExecutionStepType;
  readonly name: string;
  readonly description: string;
  readonly order: number;
  readonly status:
    FactoryExecutionStepStatus;
  readonly dependsOn:
    readonly FactoryStepId[];
  readonly startedAt:
    string | null;
  readonly completedAt:
    string | null;
  readonly attempts: number;
  readonly error:
    FactoryErrorSnapshot | null;
}

export interface FactoryValidationGate {
  readonly id:
    FactoryValidationGateId;
  readonly packId:
    FactoryPackId;
  readonly type:
    FactoryValidationGateType;
  readonly name: string;
  readonly required: boolean;
  readonly status:
    FactoryValidationGateStatus;
  readonly command:
    string | null;
  readonly startedAt:
    string | null;
  readonly completedAt:
    string | null;
  readonly output:
    string | null;
  readonly error:
    FactoryErrorSnapshot | null;
}

export interface FactoryErrorSnapshot {
  readonly name: string;
  readonly code:
    FactoryErrorCode;
  readonly message: string;
  readonly severity:
    FactoryErrorSeverity;
  readonly recoverable: boolean;
  readonly details:
    Readonly<
      Record<
        string,
        unknown
      >
    >;
  readonly occurredAt: string;
}

export interface FactoryPack {
  readonly id:
    FactoryPackId;
  readonly name: string;
  readonly description: string;
  readonly type:
    FactoryPackType;
  readonly status:
    FactoryPackStatus;
  readonly version: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly startedAt:
    string | null;
  readonly completedAt:
    string | null;
  readonly steps:
    readonly FactoryExecutionStep[];
  readonly validationGates:
    readonly FactoryValidationGate[];
  readonly errors:
    readonly FactoryErrorSnapshot[];
  readonly metadata:
    Readonly<
      Record<
        string,
        unknown
      >
    >;
}

export interface CreateFactoryPackInput {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly type:
    FactoryPackType;
  readonly metadata?:
    Readonly<
      Record<
        string,
        unknown
      >
    >;
  readonly createdAt?: string;
}

export interface CreateFactoryExecutionStepInput {
  readonly id: string;
  readonly type:
    FactoryExecutionStepType;
  readonly name: string;
  readonly description?: string;
  readonly order: number;
  readonly dependsOn?:
    readonly FactoryStepId[];
}

export interface CreateFactoryValidationGateInput {
  readonly id: string;
  readonly type:
    FactoryValidationGateType;
  readonly name: string;
  readonly required?: boolean;
  readonly command?: string;
}
