import type {
  FactoryErrorSnapshot,
  FactoryPackId,
  FactoryValidationGateId,
  FactoryValidationGateType,
} from "../domain";

export type FactoryValidationPipelineId =
  string & {
    readonly __factoryValidationPipelineId:
      unique symbol;
  };

export type FactoryValidationPipelineStatus =
  | "draft"
  | "ready"
  | "running"
  | "passed"
  | "failed"
  | "cancelled";

export type FactoryValidationExecutionMode =
  | "fail-fast"
  | "continue-on-error";

export type FactoryValidationResultStatus =
  | "passed"
  | "failed"
  | "skipped";

export interface FactoryValidationCommandResult {
  readonly exitCode: number;
  readonly stdout: string;
  readonly stderr: string;
}

export interface FactoryValidationGateDefinition {
  readonly id:
    FactoryValidationGateId;
  readonly packId:
    FactoryPackId;
  readonly type:
    FactoryValidationGateType;
  readonly name: string;
  readonly description: string;
  readonly command:
    string | null;
  readonly workingDirectory:
    string | null;
  readonly required: boolean;
  readonly enabled: boolean;
  readonly timeoutMs: number;
  readonly order: number;
  readonly metadata:
    Readonly<
      Record<
        string,
        unknown
      >
    >;
}

export interface CreateFactoryValidationGateDefinitionInput {
  readonly id: string;
  readonly packId:
    FactoryPackId;
  readonly type:
    FactoryValidationGateType;
  readonly name: string;
  readonly description?: string;
  readonly command?: string | null;
  readonly workingDirectory?: string | null;
  readonly required?: boolean;
  readonly enabled?: boolean;
  readonly timeoutMs?: number;
  readonly order: number;
  readonly metadata?:
    Readonly<
      Record<
        string,
        unknown
      >
    >;
}

export interface FactoryValidationGateResult {
  readonly gateId:
    FactoryValidationGateId;
  readonly gateType:
    FactoryValidationGateType;
  readonly name: string;
  readonly required: boolean;
  readonly status:
    FactoryValidationResultStatus;
  readonly command:
    string | null;
  readonly exitCode:
    number | null;
  readonly stdout: string;
  readonly stderr: string;
  readonly startedAt: string;
  readonly completedAt: string;
  readonly durationMs: number;
  readonly error:
    FactoryErrorSnapshot | null;
}

export interface FactoryValidationPipeline {
  readonly id:
    FactoryValidationPipelineId;
  readonly packId:
    FactoryPackId;
  readonly name: string;
  readonly description: string;
  readonly status:
    FactoryValidationPipelineStatus;
  readonly mode:
    FactoryValidationExecutionMode;
  readonly version: number;
  readonly gates:
    readonly FactoryValidationGateDefinition[];
  readonly results:
    readonly FactoryValidationGateResult[];
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly startedAt:
    string | null;
  readonly completedAt:
    string | null;
  readonly metadata:
    Readonly<
      Record<
        string,
        unknown
      >
    >;
}

export interface CreateFactoryValidationPipelineInput {
  readonly id: string;
  readonly packId:
    FactoryPackId;
  readonly name: string;
  readonly description?: string;
  readonly mode?:
    FactoryValidationExecutionMode;
  readonly createdAt?: string;
  readonly metadata?:
    Readonly<
      Record<
        string,
        unknown
      >
    >;
}

export interface FactoryValidationRunnerContext {
  readonly gate:
    FactoryValidationGateDefinition;
  readonly signal:
    AbortSignal | null;
}

export type FactoryValidationRunner =
  (
    context:
      FactoryValidationRunnerContext,
  ) => Promise<
    FactoryValidationCommandResult
  >;

export interface FactoryValidationRunOptions {
  readonly runner:
    FactoryValidationRunner;
  readonly now?:
    () => string;
  readonly signal?:
    AbortSignal | null;
}

export interface FactoryValidationPipelineSummary {
  readonly total: number;
  readonly enabled: number;
  readonly required: number;
  readonly passed: number;
  readonly failed: number;
  readonly skipped: number;
  readonly requiredPassed: number;
  readonly requiredFailed: number;
  readonly releaseReady: boolean;
}

export interface FactoryValidationPipelineValidationIssue {
  readonly code:
    | "NO_GATES"
    | "DUPLICATE_GATE"
    | "INVALID_ORDER"
    | "INVALID_TIMEOUT"
    | "MISSING_COMMAND"
    | "MISSING_REQUIRED_GATE";
  readonly path: string;
  readonly message: string;
}

export interface FactoryValidationPipelineValidationResult {
  readonly valid: boolean;
  readonly issues:
    readonly FactoryValidationPipelineValidationIssue[];
}
