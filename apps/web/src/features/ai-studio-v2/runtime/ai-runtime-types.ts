export type AIRuntimeCapability =
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

export interface AIRuntimeProvider {
  id: string;
  name: string;
  capability: AIRuntimeCapability;
  module: string;
  available: boolean;
  scope: string;
}

export interface AIRuntimeCollection<T = AIRuntimeProvider> {
  source: "creatoros-runtime";
  generatedAt: string;
  total: number;
  items: T[];
}

export interface AIRuntimeOverview {
  status: "operational" | "degraded";
  generatedAt: string;
  providers: number;
  capabilities: Record<AIRuntimeCapability, number>;
  health: number;
}

export interface AIStudioRuntimeSnapshot {
  overview: AIRuntimeOverview;
  agents: AIRuntimeCollection;
  tasks: AIRuntimeCollection;
  workflows: AIRuntimeCollection;
  approvals: AIRuntimeCollection;
  memory: AIRuntimeCollection;
  models: AIRuntimeCollection;
  executions: AIRuntimeCollection;
  tools: AIRuntimeCollection;
  queues: AIRuntimeCollection;
  logs: AIRuntimeCollection;
}

export type AIRuntimeCommandAction =
  | "inspect"
  | "ping"
  | "dry-run";

export type AIRuntimeExecutionStatus =
  | "completed"
  | "failed"
  | "awaiting_approval";

export interface AIRuntimeCommandRequest {
  providerId: string;
  action: AIRuntimeCommandAction;
  input?: Record<string, unknown>;
}

export interface AIRuntimeExecution {
  id: string;
  providerId: string;
  providerName: string;
  capability: AIRuntimeCapability;
  action: AIRuntimeCommandAction;
  status: AIRuntimeExecutionStatus;
  approvalRequired: boolean;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  createdAt: string;
  completedAt: string | null;
}

export type AIRuntimeExecutionCollection =
  AIRuntimeCollection<AIRuntimeExecution>;
