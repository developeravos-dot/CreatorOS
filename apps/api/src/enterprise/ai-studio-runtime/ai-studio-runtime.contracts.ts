export type AiStudioRuntimeCapability =
  | "agent"
  | "task"
  | "workflow"
  | "approval"
  | "memory"
  | "model"
  | "execution"
  | "tool"
  | "queue"
  | "logging";

export interface AiStudioRuntimeProvider {
  id: string;
  name: string;
  capability: AiStudioRuntimeCapability;
  module: string;
  available: boolean;
  scope: string;
}

export interface AiStudioRuntimeOverview {
  status: "operational" | "degraded";
  generatedAt: string;
  providers: number;
  capabilities: Record<AiStudioRuntimeCapability, number>;
  health: number;
}

export interface AiStudioRuntimeCollection<T> {
  source: "creatoros-runtime";
  generatedAt: string;
  total: number;
  items: T[];
}

export type AiStudioRuntimeCommandAction =
  | "inspect"
  | "ping"
  | "dry-run";

export type AiStudioRuntimeExecutionStatus =
  | "completed"
  | "failed"
  | "awaiting_approval";

export interface AiStudioRuntimeCommandRequest {
  providerId: string;
  action: AiStudioRuntimeCommandAction;
  input?: Record<string, unknown>;
}

export interface AiStudioRuntimeExecution {
  id: string;
  providerId: string;
  providerName: string;
  capability: AiStudioRuntimeCapability;
  action: AiStudioRuntimeCommandAction;
  status: AiStudioRuntimeExecutionStatus;
  approvalRequired: boolean;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  createdAt: string;
  completedAt: string | null;
}
