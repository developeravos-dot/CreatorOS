export type RuntimeExecutionOperation =
  | "inspect"
  | "ping"
  | "dry-run";

export interface ExecuteRuntimeStepInput {
  operation?: RuntimeExecutionOperation;
  payload?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  requestedBy?: string;
}

export interface RuntimeGatewayCommand {
  providerId: string;
  command: RuntimeExecutionOperation;
  payload: Record<string, unknown>;
  metadata: Record<string, unknown>;
}

export interface RuntimeGatewayExecutionResult {
  stepId: string;
  jobId: string;
  sessionId: string;
  providerId: string;
  operation: RuntimeExecutionOperation;
  success: boolean;
  resultId: string;
  output: Record<string, unknown>;
  durationMs: number;
  completedAt: string;
}

export interface RuntimeGatewayFailureResult {
  stepId: string;
  jobId: string;
  sessionId: string;
  providerId: string;
  operation: RuntimeExecutionOperation;
  success: false;
  resultId: string;
  errorCode: string;
  errorMessage: string;
  durationMs: number;
  failedAt: string;
}